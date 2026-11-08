
import React, { useState, useCallback, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { 
  GameScreenState, GameMode, TriviaCategory, TriviaQuestion, DifficultySetting, 
  MemoryDifficultySetting, SourceDataItem, TriviaOption, GameEndPayload, MemoryCardData,
  OrderVerseItem, OrderVerseDifficultySetting, ReciteVerseItem, ReciteVerseDifficultySetting, Difficulty,
  BookData, BookSortDifficultySetting, BookSortGameEndPayload, PlayerInfo
} from './types';
import { 
  TRIVIA_SOURCE_DATA, BIBLE_BOOKS_DATA, CATEGORIES, DIFFICULTY_LEVELS, MEMORY_DIFFICULTY_SETTINGS, 
  ORDER_VERSE_DIFFICULTY_SETTINGS, RECITE_VERSE_DIFFICULTY_SETTINGS, BOOK_SORT_OPTIONS_EXTENDED,
  MINIMUM_SOURCE_DATA_ITEMS_TRIVIA, MINIMUM_PAIRS_MEMORY, MINIMUM_VERSES_ORDER_VERSE, MINIMUM_VERSES_RECITE_VERSE, MINIMUM_BOOKS_SORT,
  GOOGLE_SCRIPT_URL
} from './constants';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen'; 
import MemoryGameScreen from './components/MemoryGameScreen';
import OrderVerseScreen from './components/OrderVerseScreen'; 
import ReciteVerseScreen from './components/ReciteVerseScreen';
import BookSortGameScreen from './components/BookSortGameScreen';
import FinalScreen from './components/FinalScreen';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const tokenizeVerse = (text: string): string[] => {
  return text.split(/\s+/).filter(word => word.length > 0).map(word => word.trim());
};

const LOGO_URL = "https://i.postimg.cc/9MZ6CRqt/Logo.png";

const IntroAnimationScreen: React.FC<{ logoSrc: string }> = ({ logoSrc }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gradient-celestial z-50 anim-fade-in">
      <img src={logoSrc} alt="Logo Defensores de la Fe" className="w-48 h-auto md:w-64 intro-logo-animate" />
      <p className="text-xl font-serif text-gray-700 mt-6 animate-pulse">Cargando Desafío Bíblico...</p>
    </div>
  );
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreenState>(GameScreenState.Home);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(GameMode.TRIVIA);
  const [activeGameSettings, setActiveGameSettings] = useState<DifficultySetting | MemoryDifficultySetting | OrderVerseDifficultySetting | ReciteVerseDifficultySetting | BookSortDifficultySetting | null>(null);
  const [activeCategory, setActiveCategory] = useState<TriviaCategory | undefined>(CATEGORIES[0]);
  
  const [gameResults, setGameResults] = useState<GameEndPayload | null>(null);
  // Track accumulated score for Book Sort progression
  const [sessionScore, setSessionScore] = useState(0); 
  
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>([]);
  const [memoryCards, setMemoryCards] = useState<MemoryCardData[]>([]);
  const [orderVerseItems, setOrderVerseItems] = useState<OrderVerseItem[]>([]);
  const [reciteVerseItems, setReciteVerseItems] = useState<ReciteVerseItem[]>([]);
  const [bookSortItems, setBookSortItems] = useState<BookData[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [hasShownRecordToast, setHasShownRecordToast] = useState(false);
  const [currentLiveScore, setCurrentLiveScore] = useState(0);

  // Initialize best scores to 10 if not set or if less than 10
  useEffect(() => {
    const modes = [GameMode.TRIVIA, GameMode.ORDER_VERSE, GameMode.RECITE_VERSE];
    modes.forEach(mode => {
      const key = `best_score_${mode}`;
      const current = parseInt(localStorage.getItem(key) || "0");
      if (current < 10) {
        localStorage.setItem(key, "10");
      }
    });
  }, []);

  // Monitor live score for record toast
  useEffect(() => {
    if (!selectedGameMode || !activeGameSettings || activeGameSettings.level !== Difficulty.EASY) return;
    
    const storageKey = `best_score_${selectedGameMode}`;
    const savedBest = parseInt(localStorage.getItem(storageKey) || "10");

    if (currentLiveScore > savedBest && !hasShownRecordToast) {
      setHasShownRecordToast(true);
      
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-amber-500`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="text-3xl">🏆</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  ¡Nuevo Récord en Vivo!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Has superado tu marca anterior con {currentLiveScore} aciertos. ¡Sigue así o termina para registrar!
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#fbbf24', '#f59e0b', '#d97706']
                });
              }}
              className="flex-1 border-b border-gray-200 p-2 flex items-center justify-center text-xs font-medium text-amber-600 hover:bg-amber-50"
            >
              Celebrar
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Trigger manual finish
                const finishBtn = document.getElementById('finish-training-btn');
                if (finishBtn) finishBtn.click();
              }}
              className="flex-1 p-2 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Registrar ya
            </button>
          </div>
        </div>
      ), { duration: 6000 });
    }
  }, [currentLiveScore, selectedGameMode, activeGameSettings, hasShownRecordToast]);

  const [viewAnimation, setViewAnimation] = useState('anim-fade-in');
  const [isLoading, setIsLoading] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 2800); 
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = useCallback((newScreen: GameScreenState) => {
    if (newScreen === GameScreenState.Home) {
      setHasShownRecordToast(false);
      setCurrentLiveScore(0);
    }
    setViewAnimation('anim-fade-out');
    setTimeout(() => {
      setCurrentScreen(newScreen);
      setViewAnimation('anim-fade-in');
      setIsLoading(false); 
    }, 300); 
  }, []);

  const prepareTriviaQuestions = useCallback((category: TriviaCategory, difficulty: DifficultySetting): boolean => {
    // --- SPECIAL LOGIC FOR NEW TRIVIA MODES ---
    
    // 1. Bible Summaries Trivia
    if (category === TriviaCategory.BIBLE_SUMMARIES) {
        if (BIBLE_BOOKS_DATA.length < 4) {
             alert("No hay suficientes datos de libros.");
             return false;
        }
        
        const numQuestionsToSelect = difficulty.questions === -1 ? BIBLE_BOOKS_DATA.length : difficulty.questions;
        const actualNumQuestions = Math.min(BIBLE_BOOKS_DATA.length, numQuestionsToSelect);
        const selectedBooks = shuffleArray(BIBLE_BOOKS_DATA).slice(0, actualNumQuestions);

        const newGameQuestions: TriviaQuestion[] = selectedBooks.map((book) => {
            const correctOption: TriviaOption = { text: book.name, isCorrect: true };
            
            // Pick 3 random other book names
            const otherBooks = BIBLE_BOOKS_DATA.filter(b => b.id !== book.id).map(b => b.name);
            const incorrectNames = shuffleArray(otherBooks).slice(0, 3);
            const incorrectOptions: TriviaOption[] = incorrectNames.map(name => ({ text: name, isCorrect: false }));
            
            const allOptions = shuffleArray([correctOption, ...incorrectOptions]);

            return {
                id: `summary-${book.id}`,
                verse: book.summary,
                options: allOptions,
                category: TriviaCategory.BIBLE_SUMMARIES
            };
        });

        setTriviaQuestions(newGameQuestions);
        return true;
    }

    // 2. Chapter Counts Trivia
    if (category === TriviaCategory.CHAPTER_COUNTS) {
         if (BIBLE_BOOKS_DATA.length < 4) {
             alert("No hay suficientes datos de libros.");
             return false;
        }

        const numQuestionsToSelect = difficulty.questions === -1 ? BIBLE_BOOKS_DATA.length : difficulty.questions;
        const actualNumQuestions = Math.min(BIBLE_BOOKS_DATA.length, numQuestionsToSelect);
        const selectedBooks = shuffleArray(BIBLE_BOOKS_DATA).slice(0, actualNumQuestions);

        const newGameQuestions: TriviaQuestion[] = selectedBooks.map((book) => {
            const correctOption: TriviaOption = { text: `${book.chapters} cap.`, isCorrect: true };
            
            // Logic to generate plausible but incorrect answers
            // We want unique numbers that are distinct from the correct one
            let potentialIncorrects: number[] = [];
            
            // Attempt 1: Pick numbers close to the real one (+/- range)
            const range = Math.max(5, Math.floor(book.chapters * 0.3)); // 30% variation or at least 5
            for(let i=0; i<10; i++) { // try 10 times to find numbers
                const variance = Math.floor(Math.random() * (range * 2)) - range;
                const candidate = Math.max(1, book.chapters + variance); // Ensure at least 1 chapter
                if (candidate !== book.chapters && !potentialIncorrects.includes(candidate)) {
                    potentialIncorrects.push(candidate);
                }
                if (potentialIncorrects.length >= 3) break;
            }

            // Fallback: If we couldn't find enough close numbers (e.g., small books), pick random chapters from other books
            if (potentialIncorrects.length < 3) {
                 const otherBookChapters = BIBLE_BOOKS_DATA
                    .filter(b => b.chapters !== book.chapters)
                    .map(b => b.chapters);
                 const uniqueOtherChapters = Array.from(new Set(otherBookChapters)); // Remove duplicates
                 const randomOthers = shuffleArray(uniqueOtherChapters);
                 
                 for (const num of randomOthers) {
                     if (potentialIncorrects.length >= 3) break;
                     if (!potentialIncorrects.includes(num)) potentialIncorrects.push(num);
                 }
            }
            
            // If still desperate (very unlikely), just add random numbers 1-150
            while (potentialIncorrects.length < 3) {
                const rand = Math.floor(Math.random() * 150) + 1;
                if (rand !== book.chapters && !potentialIncorrects.includes(rand)) potentialIncorrects.push(rand);
            }

            const incorrectOptions: TriviaOption[] = potentialIncorrects.map(num => ({ text: `${num} cap.`, isCorrect: false }));
            const allOptions = shuffleArray([correctOption, ...incorrectOptions]);

            return {
                id: `chapters-${book.id}`,
                verse: `¿Cuántos capítulos tiene el libro de ${book.name}?`,
                options: allOptions,
                category: TriviaCategory.CHAPTER_COUNTS
            };
        });

        setTriviaQuestions(newGameQuestions);
        return true;
    }


    // --- STANDARD TRIVIA LOGIC (Existing) ---
    if (TRIVIA_SOURCE_DATA.length < MINIMUM_SOURCE_DATA_ITEMS_TRIVIA) {
        alert(`No hay suficientes datos base (${TRIVIA_SOURCE_DATA.length}) para Trivia.`);
        return false;
    }
    let candidateBaseItems: SourceDataItem[] = category === TriviaCategory.ALL ? 
        [...TRIVIA_SOURCE_DATA] : 
        TRIVIA_SOURCE_DATA.filter(item => item.category === category);
    
    const numQuestionsToSelect = difficulty.questions === -1 ? candidateBaseItems.length : difficulty.questions;

    if (candidateBaseItems.length === 0) {
      alert(`No hay preguntas de trivia disponibles para la categoría "${category}".`);
      return false;
    }
    const actualNumQuestions = Math.min(candidateBaseItems.length, numQuestionsToSelect);
    const selectedBaseItems = shuffleArray(candidateBaseItems).slice(0, actualNumQuestions);

    const newGameQuestions: TriviaQuestion[] = selectedBaseItems.map((baseItem) => {
      const correctOption: TriviaOption = { text: baseItem.correctAnswer, isCorrect: true };
      let incorrectAnswersPool = TRIVIA_SOURCE_DATA
        .filter(item => item.id !== baseItem.id) 
        .map(item => item.correctAnswer);
      
      incorrectAnswersPool = Array.from(new Set(incorrectAnswersPool.filter(ans => ans !== baseItem.correctAnswer)));
      const numberOfIncorrectOptionsToPick = Math.min(3, incorrectAnswersPool.length); 
      const incorrectOptionsTexts = shuffleArray(incorrectAnswersPool).slice(0, numberOfIncorrectOptionsToPick);
      const incorrectOptions: TriviaOption[] = incorrectOptionsTexts.map(text => ({ text, isCorrect: false }));
      const allOptions = shuffleArray([correctOption, ...incorrectOptions]);

      return {
        id: baseItem.id,
        verse: baseItem.text,
        options: allOptions,
        category: baseItem.category,
      };
    });
    
    const validGameQuestions = newGameQuestions.filter(q => q.options.length >= 2);
    if (validGameQuestions.length === 0) return false;
    setTriviaQuestions(validGameQuestions);
    return true;
  }, []);

  const prepareMemoryCards = useCallback((difficulty: MemoryDifficultySetting, category?: TriviaCategory): boolean => {
    const numPairs = difficulty.pairs;
    let sourceForMemory = TRIVIA_SOURCE_DATA;

    if (category && category !== TriviaCategory.ALL && category !== TriviaCategory.BIBLE_SUMMARIES && category !== TriviaCategory.CHAPTER_COUNTS) {
      sourceForMemory = TRIVIA_SOURCE_DATA.filter(item => item.category === category);
    }
    
    // Fallback if user selects Summary/Chapter categories in Memory mode (not implemented yet, fallback to ALL or warn)
    // Ideally, UI filters these out, but safety check:
    if (category === TriviaCategory.BIBLE_SUMMARIES || category === TriviaCategory.CHAPTER_COUNTS) {
         // Logic for Memory Game with Summaries could be added here later: Pair(Name, Summary)
         // For now, let's just alert or fallback to standard trivia data
         // Let's implement basic Name <-> Summary memory logic!
         const booksForMemory = shuffleArray(BIBLE_BOOKS_DATA).slice(0, numPairs);
         if (booksForMemory.length < numPairs) return false;
         
         let newMemoryCards: MemoryCardData[] = [];
         booksForMemory.forEach((book) => {
             const content1 = book.name;
             const content2 = category === TriviaCategory.BIBLE_SUMMARIES ? book.summary.substring(0, 50) + "..." : `${book.chapters} Capítulos`;
             
             newMemoryCards.push({ id: `${book.id}_name`, pairId: book.id, content: content1, isFlipped: false, isMatched: false });
             newMemoryCards.push({ id: `${book.id}_detail`, pairId: book.id, content: content2, isFlipped: false, isMatched: false });
         });
         setMemoryCards(shuffleArray(newMemoryCards));
         return true;
    }

    if (sourceForMemory.length < numPairs) {
        alert("No hay suficientes datos para memoria.");
        return false;
    }
    const selectedItems = shuffleArray([...sourceForMemory]).slice(0, numPairs);

    let newMemoryCards: MemoryCardData[] = [];
    selectedItems.forEach((item) => {
      newMemoryCards.push({ id: `${item.id}_text`, pairId: item.id, content: item.text, isFlipped: false, isMatched: false });
      newMemoryCards.push({ id: `${item.id}_ref`, pairId: item.id, content: item.correctAnswer, isFlipped: false, isMatched: false });
    });

    setMemoryCards(shuffleArray(newMemoryCards));
    return true;
  }, []);

  const prepareOrderVerseItems = useCallback((difficulty: OrderVerseDifficultySetting, category?: TriviaCategory): boolean => {
    // Order Verse currently only supports text verses. 
    // If user selects Summaries/Chapters, we might just default to ALL standard verses or show error.
    let sourceForOrderVerse = TRIVIA_SOURCE_DATA;
    if (category && category !== TriviaCategory.ALL && category !== TriviaCategory.BIBLE_SUMMARIES && category !== TriviaCategory.CHAPTER_COUNTS) {
        sourceForOrderVerse = TRIVIA_SOURCE_DATA.filter(item => item.category === category);
    }
    // Filter out unsupported categories for this mode
    if (category === TriviaCategory.BIBLE_SUMMARIES || category === TriviaCategory.CHAPTER_COUNTS) {
         // Could technically order the summary words? Let's leave for now.
         alert("Esta categoría no está disponible para 'Ordenar Versículo' aún.");
         return false;
    }
    
    const numVerses = difficulty.versesToOrder === -1 ? sourceForOrderVerse.length : difficulty.versesToOrder;
    if (sourceForOrderVerse.length < numVerses && difficulty.versesToOrder !== -1) return false;
    if (sourceForOrderVerse.length === 0) return false;

    const selectedItems = shuffleArray([...sourceForOrderVerse]).slice(0, numVerses);
    const newOrderVerseItems: OrderVerseItem[] = selectedItems.map(item => {
        const correctWords = tokenizeVerse(item.text);
        return {
            id: item.id,
            reference: item.correctAnswer,
            category: item.category,
            correctOrderText: item.text,
            words: shuffleArray([...correctWords]), 
            correctWordOrder: correctWords, 
        };
    });
    setOrderVerseItems(newOrderVerseItems);
    return true;
  }, []);

  const prepareReciteVerseItems = useCallback((difficulty: ReciteVerseDifficultySetting, category?: TriviaCategory): boolean => {
    let sourceData = TRIVIA_SOURCE_DATA;
    if (category && category !== TriviaCategory.ALL && category !== TriviaCategory.BIBLE_SUMMARIES && category !== TriviaCategory.CHAPTER_COUNTS) {
        sourceData = TRIVIA_SOURCE_DATA.filter(item => item.category === category);
    }
     // Filter out unsupported categories for this mode
    if (category === TriviaCategory.BIBLE_SUMMARIES || category === TriviaCategory.CHAPTER_COUNTS) {
         alert("Esta categoría no está disponible para 'Recitar Versículo'.");
         return false;
    }

    const numVerses = difficulty.versesToRecite === -1 ? sourceData.length : difficulty.versesToRecite;
    if (sourceData.length < numVerses && difficulty.versesToRecite !== -1) return false;
    
    const selectedItems = shuffleArray([...sourceData]).slice(0, numVerses);
    const newReciteItems: ReciteVerseItem[] = selectedItems.map(item => ({
        id: item.id,
        reference: item.correctAnswer,
        category: item.category,
        fullText: item.text,
        words: tokenizeVerse(item.text),
    }));
    setReciteVerseItems(newReciteItems);
    return true;
  }, []);

  const prepareBookSortItems = useCallback((difficulty: BookSortDifficultySetting): boolean => {
    let sourceData = BIBLE_BOOKS_DATA;
    
    // Updated Filtering Logic for the new Levels
    const filterGroup = difficulty.filterGroup;
    
    if (filterGroup !== 'ALL') {
        if (filterGroup === 'ALL_OT') {
            sourceData = sourceData.filter(b => b.testament === 'Old');
        } else if (filterGroup === 'ALL_NT') {
            sourceData = sourceData.filter(b => b.testament === 'New');
        } else if (filterGroup === 'FINAL_STAGE_NT') {
            // "Santiago Pedro Judas Juan (Apocalipsis)"
            sourceData = sourceData.filter(b => b.group === 'GENERAL_EPISTLES' || b.group === 'PROPHETIC_NT');
        } else {
            // Direct group match (e.g., PENTATEUCH, GOSPELS, etc.)
            sourceData = sourceData.filter(b => b.group === filterGroup);
        }
    }

    if (sourceData.length < MINIMUM_BOOKS_SORT) {
        alert(`No hay suficientes libros (${sourceData.length}) en la categoría "${difficulty.label}" para jugar. Se necesitan al menos ${MINIMUM_BOOKS_SORT}.`);
        return false;
    }

    const numBooks = difficulty.booksToOrder === -1 ? sourceData.length : difficulty.booksToOrder;
    // Always shuffle first then take slice to get random books
    const selectedItems = shuffleArray([...sourceData]).slice(0, Math.min(numBooks, sourceData.length));
    setBookSortItems(selectedItems);
    return true;
  }, []);

  const handleStartGame = useCallback((
    gameMode: GameMode,
    settings: any,
    category?: TriviaCategory
  ) => {
    setIsLoading(true);
    setSelectedGameMode(gameMode);
    setActiveGameSettings(settings);
    setActiveCategory(category); 
    setGameResults(null);
    setSessionScore(0); // Reset session score on new game start
    
    // Clear previous states
    setTriviaQuestions([]);
    setMemoryCards([]);
    setOrderVerseItems([]);
    setReciteVerseItems([]);
    setBookSortItems([]);

    let ready = false;
    if (gameMode === GameMode.TRIVIA) ready = prepareTriviaQuestions(category!, settings);
    else if (gameMode === GameMode.MEMORY) ready = prepareMemoryCards(settings, category);
    else if (gameMode === GameMode.ORDER_VERSE) ready = prepareOrderVerseItems(settings, category);
    else if (gameMode === GameMode.RECITE_VERSE) ready = prepareReciteVerseItems(settings, category);
    else if (gameMode === GameMode.BOOK_SORT) ready = prepareBookSortItems(settings);

    if (ready) {
      navigateTo(GameScreenState.Playing);
    } else {
      setIsLoading(false);
    }
  }, [prepareTriviaQuestions, prepareMemoryCards, prepareOrderVerseItems, prepareReciteVerseItems, prepareBookSortItems, navigateTo]);

  const handleNextLevel = useCallback((levelScore: number) => {
    if (selectedGameMode !== GameMode.BOOK_SORT || !activeGameSettings) return;

    setSessionScore(prev => prev + levelScore);
    
    // Find current index
    const currentIndex = BOOK_SORT_OPTIONS_EXTENDED.indexOf(activeGameSettings as BookSortDifficultySetting);
    
    if (currentIndex !== -1 && currentIndex < BOOK_SORT_OPTIONS_EXTENDED.length - 1) {
        // Next Level
        const nextSettings = BOOK_SORT_OPTIONS_EXTENDED[currentIndex + 1];
        setActiveGameSettings(nextSettings);
        
        // Prepare next level data
        setIsLoading(true);
        // Slight delay for visual transition
        setTimeout(() => {
             const ready = prepareBookSortItems(nextSettings);
             if (ready) {
                 setIsLoading(false);
             } else {
                 // Fallback if preparation fails
                 navigateTo(GameScreenState.Home);
             }
        }, 500);
    } else {
        // All levels done!
        setGameResults({
             type: 'book_sort',
             score: sessionScore + levelScore,
             totalBooks: 0, // Not applicable for total accumulated
             mistakes: 0
        } as BookSortGameEndPayload);
        navigateTo(GameScreenState.Results);
    }
  }, [selectedGameMode, activeGameSettings, prepareBookSortItems, navigateTo, sessionScore]);


  const handleGameEnd = useCallback((results: GameEndPayload) => {
    setGameResults(results);
    navigateTo(GameScreenState.Results);

    // Registration Logic
    const validModes = [GameMode.TRIVIA, GameMode.ORDER_VERSE, GameMode.RECITE_VERSE];
    const isTrainingMode = activeGameSettings?.level === Difficulty.EASY;
    
    if (selectedGameMode && validModes.includes(selectedGameMode) && isTrainingMode) {
      let score = 0;
      if (results.type === 'trivia') score = results.correctAnswersCount;
      else if (results.type === 'order_verse') score = results.versesCorrect;
      else if (results.type === 'recite_verse') score = results.versesCorrect;

      const storageKey = `best_score_${selectedGameMode}`;
      const savedBest = parseInt(localStorage.getItem(storageKey) || "10");

      // Show form if score > savedBest (which is at least 10)
      if (score > savedBest) {
        setShowRegistration(true);
      } else {
        setShowRegistration(false);
      }
    } else {
      setShowRegistration(false);
    }
  }, [navigateTo, selectedGameMode, activeGameSettings]);

  const handleRegisterScore = useCallback(async (player: PlayerInfo) => {
    if (!gameResults || !selectedGameMode) return;
    
    let score = 0;
    if (gameResults.type === 'trivia') score = gameResults.correctAnswersCount;
    else if (gameResults.type === 'order_verse') score = gameResults.versesCorrect;
    else if (gameResults.type === 'recite_verse') score = gameResults.versesCorrect;

    const payload = {
      nombre: player.nombre,
      email: player.email,
      puntaje: score,
      fecha: new Date().toISOString(),
      modo: selectedGameMode
    };

    try {
      // Use a timeout to prevent infinite loading state if network hangs
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

      // Note: mode 'no-cors' means we can't read the response, 
      // but it's often necessary for Google Apps Script to avoid preflight issues.
      // We also remove 'Content-Type': 'application/json' as it's not allowed in no-cors.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Update local storage on success (assumed in no-cors)
      localStorage.setItem(`best_score_${selectedGameMode}`, score.toString());
      setShowRegistration(false);
      alert("¡Puntaje registrado con éxito! Tu marca aparecerá en el ranking pronto.");
    } catch (error: any) {
      console.error("Error registering score:", error);
      if (error.name === 'AbortError') {
        alert("La conexión tardó demasiado. Es posible que tu puntaje se haya registrado, por favor verifica el ranking en unos minutos.");
      } else {
        alert("Hubo un problema al conectar con el servidor de ranking. Por favor intenta de nuevo.");
      }
    }
  }, [gameResults, selectedGameMode]);

  const handlePlayAgain = useCallback(() => {
    if (!activeGameSettings || !selectedGameMode) { navigateTo(GameScreenState.Home); return; }
    // Re-trigger start logic with same settings
    handleStartGame(selectedGameMode, activeGameSettings, activeCategory);
  }, [selectedGameMode, activeGameSettings, activeCategory, handleStartGame, navigateTo]);

  const handleChangeSettings = useCallback(() => {
    navigateTo(GameScreenState.Home);
  }, [navigateTo]);
  
  const renderScreen = () => {
    if (isLoading && (currentScreen === GameScreenState.Home || currentScreen === GameScreenState.Playing)) { 
        return <div className="text-center p-8 text-xl font-semibold text-gray-700">Preparando nivel...</div>;
    }
    const isTrainingMode = activeGameSettings?.level === Difficulty.EASY; 

    switch (currentScreen) {
      case GameScreenState.Home:
        return (
          <HomeScreen onStartGame={handleStartGame} disabled={isLoading} />
        );
      case GameScreenState.Playing:
        if (selectedGameMode === GameMode.TRIVIA) {
          if (triviaQuestions.length === 0) return null;
          return <GameScreen questions={triviaQuestions} onGameEnd={handleGameEnd} timerDuration={(activeGameSettings as DifficultySetting).timerDuration} isTraining={isTrainingMode} onScoreUpdate={setCurrentLiveScore} />;
        } 
        if (selectedGameMode === GameMode.MEMORY) {
            if (memoryCards.length === 0) return null;
            return <MemoryGameScreen cards={memoryCards} difficulty={activeGameSettings as MemoryDifficultySetting} onGameEnd={handleGameEnd} isTraining={isTrainingMode} />;
        }
        if (selectedGameMode === GameMode.ORDER_VERSE) {
            if (orderVerseItems.length === 0) return null;
            return <OrderVerseScreen items={orderVerseItems} difficulty={activeGameSettings as OrderVerseDifficultySetting} onGameEnd={handleGameEnd} isTraining={isTrainingMode} onScoreUpdate={setCurrentLiveScore} />;
        }
        if (selectedGameMode === GameMode.RECITE_VERSE) {
            if (reciteVerseItems.length === 0) return null;
            return <ReciteVerseScreen items={reciteVerseItems} difficultySettings={activeGameSettings as ReciteVerseDifficultySetting} onGameEnd={handleGameEnd} isTraining={isTrainingMode} onScoreUpdate={setCurrentLiveScore} />;
        }
        if (selectedGameMode === GameMode.BOOK_SORT) {
             if (bookSortItems.length === 0) return null;
             return (
                <BookSortGameScreen 
                    books={bookSortItems} 
                    difficulty={activeGameSettings as BookSortDifficultySetting} 
                    onGameEnd={handleGameEnd} 
                    onNextLevel={handleNextLevel}
                    accumulatedScore={sessionScore}
                    isTraining={isTrainingMode} 
                />
             );
        }
        return null;

      case GameScreenState.Results:
        if (!gameResults) return null;
        return (
          <FinalScreen 
            results={gameResults} 
            onPlayAgain={handlePlayAgain} 
            onChangeSettings={handleChangeSettings} 
            showRegistration={showRegistration}
            onRegister={handleRegisterScore}
          />
        );
      default: 
        navigateTo(GameScreenState.Home);
        return null;
    }
  };

  if (!appReady) return <IntroAnimationScreen logoSrc={LOGO_URL} />;

  return (
    <div className={`min-h-screen bg-gradient-celestial text-gray-800 flex flex-col font-sans ${appReady ? 'anim-fade-in' : 'opacity-0'}`}>
      <header className="w-full bg-white/80 backdrop-blur-md shadow-md py-2 px-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center">
          <button onClick={() => navigateTo(GameScreenState.Home)} className="p-0 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md">
            <img src={LOGO_URL} alt="Logo" className="h-10 w-auto" /> 
          </button>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4">
        <Toaster position="top-center" reverseOrder={false} />
        <div className={`w-full max-w-2xl ${viewAnimation}`}>
          {renderScreen()}
        </div>
      </main>
      <footer className="w-full bg-gray-100/60 backdrop-blur-sm text-gray-600 text-xs text-center p-3 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Logo" className="h-6 w-auto opacity-75" />
            <span>© {new Date().getFullYear()} Iglesia Defensores de la Fe Cristiana.</span>
          </div>
          <div className="flex space-x-4 text-lg">
             <i className="fab fa-facebook-f text-gray-400"></i>
             <i className="fab fa-instagram text-gray-400"></i>
             <i className="fab fa-youtube text-gray-400"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
