import { JournalEntry } from '../types';

/**
 * Calcula o tempo de leitura estimado de um texto
 * @param text Texto para calcular
 * @returns Tempo estimado em minutos
 */
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Formata o tempo de leitura para exibição
 * @param minutes Minutos de leitura
 * @returns String formatada
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return 'Menos de 1 min';
  if (minutes === 1) return '1 min';
  return `${minutes} min`;
};

/**
 * Obtém uma mensagem motivacional baseada no streak
 * @param streak Número de dias consecutivos
 * @returns Mensagem motivacional
 */
export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Comece sua jornada hoje! ✨';
  if (streak === 1) return 'Primeiro dia! Continue assim! 🌱';
  if (streak < 7) return `${streak} dias! Você está indo bem! 🔥`;
  if (streak < 30) return `${streak} dias! Incrível! 🚀`;
  if (streak < 100) return `${streak} dias! Você é uma lenda! 🏆`;
  return `${streak} dias! Absolutamente espetacular! 👑`;
};

/**
 * Gera um resumo estatístico das entradas
 * @param entries Array de entradas
 * @returns Objeto com estatísticas
 */
export const generateStats = (entries: JournalEntry[]) => {
  const totalWords = entries.reduce((sum, entry) => {
    return sum + entry.content.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, 0);

  const avgWords = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;
  
  const longestEntry = entries.reduce((longest, current) => {
    const currentWords = current.content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const longestWords = longest.content.trim().split(/\s+/).filter(w => w.length > 0).length;
    return currentWords > longestWords ? current : longest;
  }, entries[0] || { content: '' });

  const moodCount = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];

  return {
    totalEntries: entries.length,
    totalWords,
    avgWords,
    longestEntry,
    mostCommonMood: mostCommonMood ? mostCommonMood[0] : null,
    moodDistribution: moodCount,
  };
};

/**
 * Valida se uma string tem conteúdo significativo
 * @param text Texto para validar
 * @returns true se o texto é válido
 */
export const isValidEntry = (text: string): boolean => {
  const trimmed = text.trim();
  if (trimmed.length < 10) return false;
  
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  return words.length >= 3;
};

/**
 * Trunca um texto para um comprimento máximo
 * @param text Texto para truncar
 * @param maxLength Comprimento máximo
 * @returns Texto truncado
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
