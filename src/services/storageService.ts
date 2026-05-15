import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, StreakData } from '../types';
import { format, parseISO, differenceInDays, isToday, isYesterday } from 'date-fns';

const ENTRIES_KEY = '@journal_entries';
const STREAK_KEY = '@journal_streak';

export const saveEntry = async (entry: JournalEntry): Promise<void> => {
  try {
    const entries = await getEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.unshift(entry);
    }
    
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    await updateStreak(entry.date);
  } catch (error) {
    console.error('Error saving entry:', error);
    throw error;
  }
};

export const getEntries = async (): Promise<JournalEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(ENTRIES_KEY);
    if (!data) return [];
    
    const entries = JSON.parse(data);
    // Ordena por data mais recente primeiro
    return entries.sort((a: JournalEntry, b: JournalEntry) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting entries:', error);
    return [];
  }
};

export const getEntryByDate = async (date: string): Promise<JournalEntry | null> => {
  try {
    const entries = await getEntries();
    return entries.find(e => e.date === date) || null;
  } catch (error) {
    console.error('Error getting entry by date:', error);
    return null;
  }
};

export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const entries = await getEntries();
    const filtered = entries.filter(e => e.id !== id);
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};

export const updateStreak = async (entryDate: string): Promise<void> => {
  try {
    const streakData = await getStreak();
    const entries = await getEntries();
    
    // Agrupa entradas por data única
    const uniqueDates = new Set(entries.map(e => e.date));
    const sortedDates = Array.from(uniqueDates).sort((a, b) => 
      parseISO(b).getTime() - parseISO(a).getTime()
    );
    
    // Calcula streak atual
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = parseISO(sortedDates[i]);
      const expectedDaysBack = i;
      const actualDaysBack = differenceInDays(today, date);
      
      if (actualDaysBack === expectedDaysBack) {
        currentStreak++;
      } else if (actualDaysBack === expectedDaysBack + 1 && i === 0) {
        // Se a primeira entrada foi ontem, ainda conta
        currentStreak++;
      } else {
        break;
      }
    }
    
    const newStreakData: StreakData = {
      currentStreak,
      longestStreak: Math.max(streakData.longestStreak, currentStreak),
      lastEntryDate: entryDate,
      totalEntries: entries.length,
    };
    
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(newStreakData));
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

export const getStreak = async (): Promise<StreakData> => {
  try {
    const data = await AsyncStorage.getItem(STREAK_KEY);
    if (!data) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastEntryDate: null,
        totalEntries: 0,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastEntryDate: null,
      totalEntries: 0,
    };
  }
};

export const hasEntryToday = async (): Promise<boolean> => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const entry = await getEntryByDate(today);
    return entry !== null;
  } catch (error) {
    console.error('Error checking today entry:', error);
    return false;
  }
};
