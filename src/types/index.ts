export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  createdAt: number;
}

export interface DailyPrompt {
  id: string;
  text: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'creativity';
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  totalEntries: number;
}
