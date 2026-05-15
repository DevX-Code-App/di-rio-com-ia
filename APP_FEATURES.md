# 📔 Diário Pessoal com IA

Um aplicativo completo de diário pessoal com sugestões de reflexões geradas por IA e sistema de streaks motivacional.

## ✨ Funcionalidades Principais

### 1. 📝 Escrita de Diário
- Interface limpa e intuitiva para escrever suas reflexões diárias
- Seleção de humor (5 opções: Ótimo, Bom, Ok, Ruim, Péssimo)
- Contador de palavras em tempo real
- Uma entrada por dia (pode ser editada durante o dia)
- Editor de texto multilinha com scroll automático

### 2. 🤖 Sugestões de IA
- **26 prompts de reflexão** divididos em 4 categorias:
  - 🧠 **Reflexão**: Perguntas para autoconhecimento
  - ❤️ **Gratidão**: Reflexões sobre agradecimentos
  - 🎯 **Metas**: Foco em objetivos e crescimento
  - 🎨 **Criatividade**: Prompts imaginativos
- Prompt diário fixo (mesmo durante todo o dia)
- Botão para gerar prompts aleatórios
- Categorização visual com cores e ícones

### 3. 🔥 Sistema de Streaks
- **Streak atual**: Contador de dias consecutivos
- **Recorde**: Maior sequência já alcançada
- **Total de entradas**: Contador geral
- Visualização com ícone de fogo animado
- Mensagens motivacionais baseadas no progresso

### 4. 📚 Histórico
- Lista de todas as entradas anteriores
- Ordenação por data (mais recente primeiro)
- Exibição de humor com emojis
- Expansão/contração de entradas
- Prévia de 100 caracteres para entradas longas
- Opção de excluir entradas
- Estado vazio com mensagem informativa

### 5. 📊 Insights & Estatísticas
- **Estatísticas Gerais**:
  - Total de entradas
  - Total de palavras escritas
  - Média de palavras por entrada
  
- **Distribuição de Humor**:
  - Gráfico de barras com porcentagens
  - Contagem de cada tipo de humor
  - Cores diferentes para cada humor
  
- **Calendário Mensal**:
  - Visualização dos dias com entradas
  - Destaque do dia atual
  - Grade completa do mês

### 6. ⚙️ Configurações
- **Exportação de Dados**:
  - Exportar como texto formatado
  - Exportar como JSON para backup
  - Compartilhamento direto
  - Copiar para área de transferência
  
- **Informações**:
  - Sobre o aplicativo
  - Versão atual
  - Privacidade (dados locais)

### 7. 👋 Onboarding
- Modal de boas-vindas na primeira abertura
- Explicação das funcionalidades principais
- Design moderno com blur background
- Apresentação de 4 recursos principais

## 🎨 Design

### Cores Principais
- **Primária**: #2196F3 (Azul)
- **Secundária**: #4ECDC4 (Turquesa)
- **Accent**: #FF6B35 (Laranja)
- **Fundo**: #F5F7FA (Cinza claro)
- **Texto**: #2C3E50 (Cinza escuro)

### Componentes de UI
- Cards com sombras suaves
- Bordas arredondadas (12-20px)
- Ícones do Ionicons
- Animações suaves
- Feedback visual em todas as ações

## 🗂️ Estrutura do Projeto

```
src/
├── components/
│   ├── EmptyState.tsx          # Estado vazio reutilizável
│   ├── MoodSelector.tsx        # Seletor de humor
│   ├── PromptCard.tsx          # Card de sugestão diária
│   ├── StreakCard.tsx          # Card de streak
│   ├── StreakCelebration.tsx   # Animação de celebração
│   ├── WelcomeModal.tsx        # Modal de boas-vindas
│   └── index.ts                # Exports
│
├── screens/
│   ├── HomeScreen.tsx          # Tela principal (escrita)
│   ├── HistoryScreen.tsx       # Histórico de entradas
│   ├── InsightsScreen.tsx      # Estatísticas e insights
│   └── SettingsScreen.tsx      # Configurações
│
├── services/
│   ├── promptService.ts        # Gerenciamento de prompts
│   └── storageService.ts       # AsyncStorage (CRUD)
│
├── types/
│   └── index.ts                # TypeScript types
│
└── utils/
    ├── constants.ts            # Cores e tamanhos
    ├── export.ts               # Exportação de dados
    └── helpers.ts              # Funções auxiliares
```

## 📱 Navegação

4 tabs principais:
1. **Escrever** (Home) - Criação/edição de entradas
2. **Histórico** - Lista de todas as entradas
3. **Insights** - Estatísticas e análises
4. **Configurações** - Exportação e sobre

## 💾 Armazenamento

- **AsyncStorage** para persistência local
- Dados armazenados apenas no dispositivo (100% privado)
- Estrutura JSON para fácil exportação
- Backup via exportação manual

## 🔐 Privacidade

- Sem conexão com servidores
- Dados nunca saem do dispositivo
- Sem analytics ou tracking
- Sem necessidade de login/cadastro

## 🚀 Tecnologias

- **React Native** (0.76.7)
- **Expo** (~52.0)
- **TypeScript**
- **React Navigation** (Bottom Tabs)
- **AsyncStorage** (Persistência)
- **date-fns** (Manipulação de datas)
- **Expo Vector Icons** (Ionicons)
- **Expo Blur** (Efeitos visuais)

## 📈 Roadmap Futuro

Possíveis melhorias:
- [ ] Pesquisa de entradas
- [ ] Tags/categorias customizadas
- [ ] Anexar fotos às entradas
- [ ] Gráficos de humor ao longo do tempo
- [ ] Notificações para lembrar de escrever
- [ ] Temas claro/escuro
- [ ] Senhas/biometria para proteção
- [ ] Backup automático na nuvem (opcional)
- [ ] Integração com IA real (GPT) para análises
- [ ] Widget para iOS/Android

## 🎯 Público-Alvo

- Pessoas buscando autoconhecimento
- Quem quer manter um diário consistente
- Usuários interessados em mindfulness
- Quem busca tracking de humor e bem-estar
