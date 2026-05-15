import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { JournalEntry } from '../types';

interface FilterBarProps {
  selectedFilter: 'all' | JournalEntry['mood'];
  onFilterChange: (filter: 'all' | JournalEntry['mood']) => void;
}

const filters: Array<{ value: 'all' | JournalEntry['mood']; label: string; emoji?: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'great', label: 'Ótimo', emoji: '😄' },
  { value: 'good', label: 'Bom', emoji: '🙂' },
  { value: 'okay', label: 'Ok', emoji: '😐' },
  { value: 'bad', label: 'Ruim', emoji: '😔' },
  { value: 'terrible', label: 'Péssimo', emoji: '😢' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, onFilterChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.value}
          style={[
            styles.filterButton,
            selectedFilter === filter.value && styles.filterButtonActive,
          ]}
          onPress={() => onFilterChange(filter.value)}
        >
          {filter.emoji && <Text style={styles.emoji}>{filter.emoji}</Text>}
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter.value && styles.filterTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 60,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});
