import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { JournalEntry } from '../types';

interface MoodSelectorProps {
  selectedMood?: JournalEntry['mood'];
  onSelectMood: (mood: JournalEntry['mood']) => void;
}

const moods: Array<{ value: JournalEntry['mood']; emoji: string; label: string }> = [
  { value: 'great', emoji: '😄', label: 'Ótimo' },
  { value: 'good', emoji: '🙂', label: 'Bom' },
  { value: 'okay', emoji: '😐', label: 'Ok' },
  { value: 'bad', emoji: '😔', label: 'Ruim' },
  { value: 'terrible', emoji: '😢', label: 'Péssimo' },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Como você está se sentindo?</Text>
      <View style={styles.moodsContainer}>
        {moods.map(mood => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodButton,
              selectedMood === mood.value && styles.moodButtonSelected,
            ]}
            onPress={() => onSelectMood(mood.value)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.moodLabel,
                selectedMood === mood.value && styles.moodLabelSelected,
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  moodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  moodLabelSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
});
