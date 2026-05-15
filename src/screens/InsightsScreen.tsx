import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

import { JournalEntry } from '../types';
import { getEntries } from '../services/storageService';

const { width } = Dimensions.get('window');

export const InsightsScreen: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moodStats, setMoodStats] = useState({
    great: 0,
    good: 0,
    okay: 0,
    bad: 0,
    terrible: 0,
  });

  const loadData = async () => {
    const data = await getEntries();
    setEntries(data);

    // Calcula estatísticas de humor
    const stats = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0,
    };

    data.forEach(entry => {
      if (entry.mood) {
        stats[entry.mood]++;
      }
    });

    setMoodStats(stats);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const totalMoods = Object.values(moodStats).reduce((a, b) => a + b, 0);

  const getMoodPercentage = (count: number) => {
    if (totalMoods === 0) return 0;
    return Math.round((count / totalMoods) * 100);
  };

  const getCalendarData = () => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });

    const entryDates = new Set(entries.map(e => e.date));

    return days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      hasEntry: entryDates.has(format(day, 'yyyy-MM-dd')),
      dayNumber: format(day, 'd'),
      isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
    }));
  };

  const calendarData = getCalendarData();
  const totalWords = entries.reduce((sum, entry) => {
    return sum + entry.content.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, 0);

  const avgWords = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <Text style={styles.headerSubtitle}>Suas estatísticas de diário</Text>
      </View>

      {/* Stats gerais */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="book" size={32} color="#3498DB" />
          <Text style={styles.statNumber}>{entries.length}</Text>
          <Text style={styles.statLabel}>Entradas</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="create" size={32} color="#9B59B6" />
          <Text style={styles.statNumber}>{totalWords}</Text>
          <Text style={styles.statLabel}>Palavras</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="bar-chart" size={32} color="#E67E22" />
          <Text style={styles.statNumber}>{avgWords}</Text>
          <Text style={styles.statLabel}>Média/Entrada</Text>
        </View>
      </View>

      {/* Humor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distribuição de Humor</Text>
        
        {totalMoods === 0 ? (
          <View style={styles.emptyMood}>
            <Text style={styles.emptyMoodText}>
              Adicione seu humor às entradas para ver estatísticas
            </Text>
          </View>
        ) : (
          <View style={styles.moodBars}>
            <MoodBar emoji="😄" label="Ótimo" count={moodStats.great} percentage={getMoodPercentage(moodStats.great)} color="#27AE60" />
            <MoodBar emoji="🙂" label="Bom" count={moodStats.good} percentage={getMoodPercentage(moodStats.good)} color="#3498DB" />
            <MoodBar emoji="😐" label="Ok" count={moodStats.okay} percentage={getMoodPercentage(moodStats.okay)} color="#95A5A6" />
            <MoodBar emoji="😔" label="Ruim" count={moodStats.bad} percentage={getMoodPercentage(moodStats.bad)} color="#E67E22" />
            <MoodBar emoji="😢" label="Péssimo" count={moodStats.terrible} percentage={getMoodPercentage(moodStats.terrible)} color="#E74C3C" />
          </View>
        )}
      </View>

      {/* Calendário do mês */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
        </Text>
        <View style={styles.calendar}>
          {calendarData.map((day, index) => (
            <View
              key={day.date}
              style={[
                styles.calendarDay,
                day.hasEntry && styles.calendarDayActive,
                day.isToday && styles.calendarDayToday,
              ]}
            >
              <Text
                style={[
                  styles.calendarDayText,
                  day.hasEntry && styles.calendarDayTextActive,
                  day.isToday && styles.calendarDayTextToday,
                ]}
              >
                {day.dayNumber}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.calendarLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
            <Text style={styles.legendText}>Com entrada</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { borderWidth: 2, borderColor: '#2196F3' }]} />
            <Text style={styles.legendText}>Hoje</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const MoodBar: React.FC<{ emoji: string; label: string; count: number; percentage: number; color: string }> = ({
  emoji,
  label,
  count,
  percentage,
  color,
}) => {
  return (
    <View style={styles.moodBarContainer}>
      <View style={styles.moodBarHeader}>
        <View style={styles.moodBarLabel}>
          <Text style={styles.moodBarEmoji}>{emoji}</Text>
          <Text style={styles.moodBarText}>{label}</Text>
        </View>
        <Text style={styles.moodBarPercentage}>{percentage}%</Text>
      </View>
      <View style={styles.moodBarTrack}>
        <View style={[styles.moodBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.moodBarCount}>{count} {count === 1 ? 'vez' : 'vezes'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingBottom: 40,
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
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  moodBars: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  moodBarContainer: {
    marginBottom: 20,
  },
  moodBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodBarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodBarEmoji: {
    fontSize: 20,
  },
  moodBarText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  moodBarPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  moodBarTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  moodBarCount: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 4,
  },
  emptyMood: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyMoodText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  calendarDay: {
    width: (width - 40 - 32 - 48) / 7,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  calendarDayActive: {
    backgroundColor: '#4ECDC4',
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#95A5A6',
  },
  calendarDayTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  calendarDayTextToday: {
    color: '#2196F3',
    fontWeight: '600',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});
