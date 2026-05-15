import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakData } from '../types';

interface StreakCardProps {
  streakData: StreakData;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainStreak}>
        <Ionicons name="flame" size={48} color="#FF6B35" />
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
          <Text style={styles.streakLabel}>
            {streakData.currentStreak === 1 ? 'dia' : 'dias'} consecutivos
          </Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{streakData.longestStreak}</Text>
          <Text style={styles.statLabel}>Recorde</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.stat}>
          <Ionicons name="book" size={24} color="#4ECDC4" />
          <Text style={styles.statNumber}>{streakData.totalEntries}</Text>
          <Text style={styles.statLabel}>Entradas</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  mainStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  streakInfo: {
    marginLeft: 16,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  streakLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
});
