import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { JournalEntry, DailyPrompt, StreakData } from '../types';
import { StreakCard } from '../components/StreakCard';
import { PromptCard } from '../components/PromptCard';
import { MoodSelector } from '../components/MoodSelector';
import { WelcomeModal } from '../components/WelcomeModal';
import { getDailyPrompt, getRandomPrompt } from '../services/promptService';
import { saveEntry, getEntryByDate, getStreak, hasEntryToday } from '../services/storageService';

const WELCOME_SHOWN_KEY = '@welcome_shown';

export const HomeScreen: React.FC = () => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>();
  const [prompt, setPrompt] = useState<DailyPrompt>(getDailyPrompt());
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastEntryDate: null,
    totalEntries: 0,
  });
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasShown = await AsyncStorage.getItem(WELCOME_SHOWN_KEY);
      if (!hasShown) {
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Error checking first time:', error);
    }
  };

  const handleCloseWelcome = async () => {
    try {
      await AsyncStorage.setItem(WELCOME_SHOWN_KEY, 'true');
      setShowWelcome(false);
    } catch (error) {
      console.error('Error saving welcome state:', error);
      setShowWelcome(false);
    }
  };

  const loadData = async () => {
    try {
      const [todayEntry, streak] = await Promise.all([
        getEntryByDate(today),
        getStreak(),
      ]);

      if (todayEntry) {
        setCurrentEntry(todayEntry);
        setContent(todayEntry.content);
        setMood(todayEntry.mood);
      } else {
        setCurrentEntry(null);
        setContent('');
        setMood(undefined);
      }

      setStreakData(streak);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Atenção', 'Escreva algo antes de salvar!');
      return;
    }

    setIsSaving(true);
    try {
      const entry: JournalEntry = {
        id: currentEntry?.id || `entry_${Date.now()}`,
        date: today,
        content: content.trim(),
        mood,
        createdAt: currentEntry?.createdAt || Date.now(),
      };

      await saveEntry(entry);
      
      // Atualiza streak
      const newStreak = await getStreak();
      setStreakData(newStreak);
      
      Alert.alert(
        'Salvo!', 
        currentEntry ? 'Sua entrada foi atualizada.' : '🎉 Entrada criada! Continue sua sequência!',
        [{ text: 'OK' }]
      );
      
      setCurrentEntry(entry);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a entrada.');
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshPrompt = () => {
    setPrompt(getRandomPrompt());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá! 👋</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>

        <StreakCard streakData={streakData} />

        <PromptCard prompt={prompt} onRefresh={handleRefreshPrompt} />

        <View style={styles.editorContainer}>
          <View style={styles.editorHeader}>
            <Ionicons name="create-outline" size={24} color="#2C3E50" />
            <Text style={styles.editorTitle}>
              {currentEntry ? 'Editar Entrada de Hoje' : 'Nova Entrada'}
            </Text>
          </View>

          <MoodSelector selectedMood={mood} onSelectMood={setMood} />

          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Comece a escrever seus pensamentos..."
            placeholderTextColor="#BDC3C7"
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />

          <View style={styles.footer}>
            <Text style={styles.wordCount}>
              {content.trim().split(/\s+/).filter(word => word.length > 0).length} palavras
            </Text>
            
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Ionicons 
                name={currentEntry ? "checkmark-circle" : "add-circle"} 
                size={20} 
                color="#FFF" 
              />
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Salvando...' : currentEntry ? 'Atualizar' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <WelcomeModal visible={showWelcome} onClose={handleCloseWelcome} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#7F8C8D',
    textTransform: 'capitalize',
  },
  editorContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  textInput: {
    minHeight: 200,
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  wordCount: {
    fontSize: 12,
    color: '#95A5A6',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
