import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyPrompt } from '../types';

interface PromptCardProps {
  prompt: DailyPrompt;
  onRefresh: () => void;
}

const getCategoryInfo = (category: DailyPrompt['category']) => {
  switch (category) {
    case 'reflection':
      return { icon: 'bulb-outline' as const, color: '#9B59B6', label: 'Reflexão' };
    case 'gratitude':
      return { icon: 'heart-outline' as const, color: '#E74C3C', label: 'Gratidão' };
    case 'goals':
      return { icon: 'rocket-outline' as const, color: '#3498DB', label: 'Metas' };
    case 'creativity':
      return { icon: 'color-palette-outline' as const, color: '#F39C12', label: 'Criatividade' };
  }
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onRefresh }) => {
  const categoryInfo = getCategoryInfo(prompt.category);
  
  return (
    <View style={[styles.container, { borderLeftColor: categoryInfo.color }]}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Ionicons name={categoryInfo.icon} size={16} color={categoryInfo.color} />
          <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
            {categoryInfo.label}
          </Text>
        </View>
        
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#95A5A6" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.promptText}>{prompt.text}</Text>
      
      <View style={styles.footer}>
        <Ionicons name="sparkles" size={16} color="#95A5A6" />
        <Text style={styles.footerText}>Reflexão gerada por IA</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  refreshButton: {
    padding: 4,
  },
  promptText: {
    fontSize: 18,
    color: '#2C3E50',
    lineHeight: 26,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
});
