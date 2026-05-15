import { JournalEntry } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const exportToText = (entries: JournalEntry[]): string => {
  let text = '📔 MEU DIÁRIO PESSOAL\n';
  text += '=' .repeat(50) + '\n\n';
  
  entries.forEach((entry, index) => {
    const date = parseISO(entry.date);
    const formattedDate = format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    text += `\n${'─'.repeat(50)}\n`;
    text += `📅 ${formattedDate}\n`;
    
    if (entry.mood) {
      const moodEmojis = {
        great: '😄 Ótimo',
        good: '🙂 Bom',
        okay: '😐 Ok',
        bad: '😔 Ruim',
        terrible: '😢 Péssimo',
      };
      text += `💭 Humor: ${moodEmojis[entry.mood]}\n`;
    }
    
    text += `${'─'.repeat(50)}\n\n`;
    text += entry.content + '\n';
  });
  
  text += `\n\n${'='.repeat(50)}\n`;
  text += `Total de entradas: ${entries.length}\n`;
  text += `Exportado em: ${format(new Date(), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}\n`;
  
  return text;
};

export const exportToJSON = (entries: JournalEntry[]): string => {
  return JSON.stringify(
    {
      exportDate: new Date().toISOString(),
      totalEntries: entries.length,
      entries: entries.map(entry => ({
        ...entry,
        exportedDate: format(parseISO(entry.date), "yyyy-MM-dd"),
      })),
    },
    null,
    2
  );
};
