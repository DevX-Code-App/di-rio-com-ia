import { DailyPrompt } from '../types';

const prompts: DailyPrompt[] = [
  // Reflexão
  { id: '1', text: 'O que você aprendeu hoje sobre si mesmo?', category: 'reflection' },
  { id: '2', text: 'Qual foi o momento mais significativo do seu dia?', category: 'reflection' },
  { id: '3', text: 'Como você poderia ter tornado hoje ainda melhor?', category: 'reflection' },
  { id: '4', text: 'Que desafio você enfrentou hoje e como lidou com ele?', category: 'reflection' },
  { id: '5', text: 'O que você gostaria de ter feito diferente hoje?', category: 'reflection' },
  { id: '6', text: 'Como você se sentiu em relação às suas interações sociais hoje?', category: 'reflection' },
  { id: '7', text: 'Que padrões você percebeu em seus pensamentos hoje?', category: 'reflection' },
  { id: '8', text: 'O que te surpreendeu hoje?', category: 'reflection' },
  
  // Gratidão
  { id: '9', text: 'Liste três coisas pelas quais você é grato hoje.', category: 'gratitude' },
  { id: '10', text: 'Quem fez diferença na sua vida hoje e por quê?', category: 'gratitude' },
  { id: '11', text: 'Que pequeno prazer você experimentou hoje?', category: 'gratitude' },
  { id: '12', text: 'Que parte do seu corpo você aprecia hoje e por quê?', category: 'gratitude' },
  { id: '13', text: 'Que oportunidade você teve hoje que nem todos têm?', category: 'gratitude' },
  { id: '14', text: 'Que habilidade sua você valoriza especialmente?', category: 'gratitude' },
  
  // Metas
  { id: '15', text: 'Que progresso você fez em direção aos seus objetivos hoje?', category: 'goals' },
  { id: '16', text: 'O que você quer alcançar amanhã?', category: 'goals' },
  { id: '17', text: 'Que hábito você gostaria de desenvolver?', category: 'goals' },
  { id: '18', text: 'Como você pode cuidar melhor de si mesmo esta semana?', category: 'goals' },
  { id: '19', text: 'Que medo ou limitação você quer superar?', category: 'goals' },
  { id: '20', text: 'Onde você se vê daqui a um mês?', category: 'goals' },
  
  // Criatividade
  { id: '21', text: 'Se hoje fosse uma música, qual seria e por quê?', category: 'creativity' },
  { id: '22', text: 'Descreva seu dia usando apenas metáforas.', category: 'creativity' },
  { id: '23', text: 'Se você pudesse dar um conselho ao seu eu de ontem, qual seria?', category: 'creativity' },
  { id: '24', text: 'Que história você viveu hoje?', category: 'creativity' },
  { id: '25', text: 'Se suas emoções de hoje fossem cores, que paleta seria?', category: 'creativity' },
  { id: '26', text: 'Descreva o dia perfeito da sua perspectiva atual.', category: 'creativity' },
];

export const getRandomPrompt = (): DailyPrompt => {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
};

export const getDailyPrompt = (): DailyPrompt => {
  // Usa a data como seed para garantir o mesmo prompt durante todo o dia
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % prompts.length;
  return prompts[index];
};

export const getPromptsByCategory = (category: DailyPrompt['category']): DailyPrompt[] => {
  return prompts.filter(prompt => prompt.category === category);
};
