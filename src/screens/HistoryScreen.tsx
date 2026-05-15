import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

import { JournalEntry } from '../types';
import { getEntries, deleteEntry } from '../services/storageService';
import { FilterBar } from '../components/FilterBar';

const getMoodEmoji = (mood?: JournalEntry['mood']) => {
  switch (mood) {
    case 'great': return '😄';
    case 'good': return '🙂';
    case 'okay': return '😐';
    case 'bad': return '😔';
    case 'terrible': return '😢';
    default: return '';
  }
};

export const HistoryScreen: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | JournalEntry['mood']>('all');

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
    applyFilter(data, selectedFilter);
  };

  const applyFilter = (data: JournalEntry[], filter: 'all' | JournalEntry['mood']) => {
    if (filter === 'all') {
      setFilteredEntries(data);
    } else {
      setFilteredEntries(data.filter(entry => entry.mood === filter));
    }
  };

  const handleFilterChange = (filter: 'all' | JournalEntry['mood']) => {
    setSelectedFilter(filter);
    applyFilter(entries, filter);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const handleDelete = (entry: JournalEntry) => {
    Alert.alert(
      'Excluir Entrada',
      'Tem certeza que deseja excluir esta entrada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entry.id);
              await loadEntries();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a entrada.');
            }
          },
        },
      ]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    const isExpanded = expandedId === item.id;
    const date = parseISO(item.date);
    const formattedDate = format(date, "d 'de' MMM", { locale: ptBR });
    const fullDate = format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    const preview = item.content.length > 100 
      ? item.content.substring(0, 100) + '...' 
      : item.content;

    return (
      <View style={styles.entryCard}>
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.entryHeader}>
            <View style={styles.entryHeaderLeft}>
              {item.mood && (
                <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
              )}
              <View>
                <Text style={styles.entryDate}>{formattedDate}</Text>
                <Text style={styles.entryFullDate}>{fullDate}</Text>
              </View>
            </View>
            
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#95A5A6"
            />
          </View>

          <Text style={styles.entryContent} numberOfLines={isExpanded ? undefined : 3}>
            {isExpanded ? item.content : preview}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.entryActions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={18} color="#E74C3C" />
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color="#BDC3C7" />
      <Text style={styles.emptyTitle}>
        {selectedFilter === 'all' 
          ? 'Nenhuma entrada ainda' 
          : 'Nenhuma entrada com este filtro'}
      </Text>
      <Text style={styles.emptyText}>
        {selectedFilter === 'all'
          ? 'Comece a escrever seu diário para ver suas entradas aqui!'
          : 'Tente outro filtro ou comece a registrar seus sentimentos!'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSubtitle}>
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entrada' : 'entradas'}
          {selectedFilter !== 'all' && ' (filtradas)'}
        </Text>
      </View>

      <FilterBar selectedFilter={selectedFilter} onFilterChange={handleFilterChange} />

      <FlatList
        data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  entryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodEmoji: {
    fontSize: 28,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textTransform: 'capitalize',
  },
  entryFullDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  entryContent: {
    fontSize: 15,
    color: '#34495E',
    lineHeight: 22,
  },
  entryActions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});
