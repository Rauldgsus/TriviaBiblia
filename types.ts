
export enum GameScreenState {
  Home,
  Playing,
  Results,
}

export enum GameMode {
  TRIVIA = "Trivia Bíblica",
  MEMORY = "Juego de Memoria",
  ORDER_VERSE = "Ordenar Versículo",
  RECITE_VERSE = "Recitar Versículo",
  BOOK_SORT = "Orden de Libros", 
  TIMELINE = "Línea del Tiempo",
}

export enum TriviaCategory {
  PROMISES = "Promesas",
  COMMANDMENTS = "Mandamientos",
  JESUS_SAID = "Jesús (dijo)", 
  BIBLE_SUMMARIES = "Resumen de Libros",
  CHAPTER_COUNTS = "Cantidad de Capítulos",
  ALL = "Todas las categorías",
}

export interface SourceDataItem {
  id: string;
  text: string;
  correctAnswer: string; 
  category: TriviaCategory;
}

export interface TriviaOption {
  text: string;
  isCorrect: boolean;
}

export interface TriviaQuestion {
  id: string;
  verse: string;
  options: TriviaOption[];
  category: TriviaCategory;
}

export interface SelectedAnswerInfo {
  isCorrectResponse: boolean;
  selectedIndex: number;
  correctIndex: number;
  isTimeout: boolean;
}

export enum Difficulty {
  EASY = "Fácil",
  MEDIUM = "Medio",
  DIFFICULT = "Difícil",
}

export interface DifficultySetting { 
  level: Difficulty;
  questions: number;
  label: string;
  timerDuration: number; 
}

export interface MemoryDifficultySetting { 
  level: Difficulty;
  pairs: number;
  grid: { rows: number; cols: number };
  label: string;
  timerPerItem?: number; 
}

export interface OrderVerseItem {
  id: string; 
  reference: string; 
  category: TriviaCategory;
  correctOrderText: string; 
  words: string[]; 
  correctWordOrder: string[]; 
}

export interface OrderVerseDifficultySetting { 
  level: Difficulty;
  versesToOrder: number;
  label: string;
  timerPerItem?: number; 
}

export interface ReciteVerseItem {
  id: string; 
  reference: string; 
  category: TriviaCategory;
  fullText: string; 
  words: string[]; 
}

export type VisibleLettersMode = 'firstAndLast' | 'firstOnly' | 'none';

export interface ReciteVerseDifficultySetting {
  level: Difficulty;
  versesToRecite: number;
  visibleLettersMode: VisibleLettersMode;
  label: string;
  timerPerItem?: number; 
}

// --- BOOK SORT TYPES ---
export type BookSortCriteria = 'CANONICAL' | 'CHRONOLOGICAL' | 'ALPHABETICAL';

// New detailed groups
export type BibleBookGroup = 
  | 'PENTATEUCH' // The Law
  | 'HISTORICAL_OT'
  | 'POETIC' // Wisdom/Poetic
  | 'PROPHETS' // Major & Minor
  | 'GOSPELS'
  | 'HISTORICAL_NT'
  | 'PAULINE_EPISTLES'
  | 'GENERAL_EPISTLES'
  | 'PROPHETIC_NT' // Revelation
  | 'FINAL_STAGE_NT' // Custom: General + Revelation
  | 'ALL_OT'
  | 'ALL_NT'
  | 'ALL'; // Mixed

export interface BookData {
  id: string;
  name: string;
  testament: 'Old' | 'New';
  group: BibleBookGroup; // Category mapping
  canonicalOrder: number; // 1-66
  chronologicalOrder: number; // Approx order
  chapters: number;
  summary: string;
  author: string;
}

export interface BookSortDifficultySetting {
  level: Difficulty; // Used for ID purposes essentially
  booksToOrder: number;
  criteria: BookSortCriteria;
  filterGroup: BibleBookGroup; // Which category to play
  label: string;
  timerDuration?: number;
}
// ----------------------

// --- TIMELINE TYPES ---
export interface TimelineItemData {
  id: string;
  event: string;
  reference: string;
  orderId: number;
}

export interface TimelineDifficultySetting {
  level: Difficulty;
  itemsToOrder: number;
  label: string;
  timerDuration?: number;
}

export interface TimelineGameEndPayload {
  type: 'timeline';
  score: number;
  totalItems: number;
  mistakes: number;
}
// ----------------------

export interface TriviaGameEndPayload {
  type: 'trivia';
  netScore: number;
  correctAnswersCount: number;
  totalQuestions: number;
}

export interface MemoryGameEndPayload {
  type: 'memory';
  moves: number;
  totalPairs: number;
}

export interface OrderVerseGameEndPayload {
  type: 'order_verse';
  score: number; 
  versesAttempted: number;
  versesCorrect: number;
}

export interface ReciteVerseGameEndPayload {
  type: 'recite_verse';
  score: number; 
  versesAttempted: number;
  versesCorrect: number;
}

export interface BookSortGameEndPayload {
  type: 'book_sort';
  score: number;
  totalBooks: number;
  mistakes: number;
}

export interface PlayerInfo {
  nombre: string;
  email: string;
}

export type GameEndPayload = TriviaGameEndPayload | MemoryGameEndPayload | OrderVerseGameEndPayload | ReciteVerseGameEndPayload | BookSortGameEndPayload | TimelineGameEndPayload;


export interface MemoryCardData {
  id: string; 
  pairId: string; 
  content: string; 
  isFlipped: boolean;
  isMatched: boolean;
}
