
import React, { useState } from 'react';
import { GameMode, TriviaCategory, Difficulty, DifficultySetting, MemoryDifficultySetting, OrderVerseDifficultySetting, ReciteVerseDifficultySetting, BookSortDifficultySetting } from '../types';
import { CATEGORIES, DIFFICULTY_LEVELS, MEMORY_DIFFICULTY_SETTINGS, ORDER_VERSE_DIFFICULTY_SETTINGS, RECITE_VERSE_DIFFICULTY_SETTINGS, BOOK_SORT_OPTIONS_EXTENDED } from '../constants';
import Button from './Button';
import Dropdown from './Dropdown';

interface HomeScreenProps {
  onStartGame: (
    gameMode: GameMode,
    settings: any,
    category?: TriviaCategory
  ) => void;
  disabled?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onStartGame, 
  disabled = false
}) => {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(GameMode.TRIVIA);
  const [selectedCategory, setSelectedCategory] = useState<TriviaCategory>(CATEGORIES[0]);
  
  const [currentTriviaDifficulty, setCurrentTriviaDifficulty] = useState<DifficultySetting>(DIFFICULTY_LEVELS[0]);
  const [currentMemoryDifficulty, setCurrentMemoryDifficulty] = useState<MemoryDifficultySetting>(MEMORY_DIFFICULTY_SETTINGS[1]);
  const [currentOrderVerseDifficulty, setCurrentOrderVerseDifficulty] = useState<OrderVerseDifficultySetting>(ORDER_VERSE_DIFFICULTY_SETTINGS[0]);
  const [currentReciteVerseDifficulty, setCurrentReciteVerseDifficulty] = useState<ReciteVerseDifficultySetting>(RECITE_VERSE_DIFFICULTY_SETTINGS[0]);
  // Use extended options for Book Sort
  const [currentBookSortDifficulty, setCurrentBookSortDifficulty] = useState<BookSortDifficultySetting>(BOOK_SORT_OPTIONS_EXTENDED[0]);


  const categoryOptions = CATEGORIES.map(cat => ({ value: cat, label: cat }));
  
  const triviaDifficultyOptions = DIFFICULTY_LEVELS.map(diff => ({ value: diff.level, label: diff.label }));
  const memoryDifficultyOptions = MEMORY_DIFFICULTY_SETTINGS.map(diff => ({ value: diff.level, label: diff.label }));
  const orderVerseDifficultyOptions = ORDER_VERSE_DIFFICULTY_SETTINGS.map(diff => ({ value: diff.level, label: diff.label }));
  const reciteVerseDifficultyOptions = RECITE_VERSE_DIFFICULTY_SETTINGS.map(diff => ({ value: diff.level, label: diff.label }));
  
  // Custom options mapping for Book Sort since it uses 'filterGroup' not just difficulty level
  const bookSortDifficultyOptions = BOOK_SORT_OPTIONS_EXTENDED.map((opt, index) => ({ value: index, label: opt.label }));

  // Handlers
  const handleTriviaDifficultyChange = (value: Difficulty) => setCurrentTriviaDifficulty(DIFFICULTY_LEVELS.find(d => d.level === value) || DIFFICULTY_LEVELS[0]);
  const handleMemoryDifficultyChange = (value: Difficulty) => setCurrentMemoryDifficulty(MEMORY_DIFFICULTY_SETTINGS.find(d => d.level === value) || MEMORY_DIFFICULTY_SETTINGS[0]);
  const handleOrderVerseDifficultyChange = (value: Difficulty) => setCurrentOrderVerseDifficulty(ORDER_VERSE_DIFFICULTY_SETTINGS.find(d => d.level === value) || ORDER_VERSE_DIFFICULTY_SETTINGS[0]);
  const handleReciteVerseDifficultyChange = (value: Difficulty) => setCurrentReciteVerseDifficulty(RECITE_VERSE_DIFFICULTY_SETTINGS.find(d => d.level === value) || RECITE_VERSE_DIFFICULTY_SETTINGS[0]);
  
  // Handle index based selection for Book Sort Extended Options
  const handleBookSortDifficultyChange = (index: number) => setCurrentBookSortDifficulty(BOOK_SORT_OPTIONS_EXTENDED[index] || BOOK_SORT_OPTIONS_EXTENDED[0]);

  const handleStartClick = () => {
    switch(selectedGameMode) {
        case GameMode.TRIVIA: onStartGame(GameMode.TRIVIA, currentTriviaDifficulty, selectedCategory); break;
        case GameMode.MEMORY: onStartGame(GameMode.MEMORY, currentMemoryDifficulty, selectedCategory); break;
        case GameMode.ORDER_VERSE: onStartGame(GameMode.ORDER_VERSE, currentOrderVerseDifficulty, selectedCategory); break;
        case GameMode.RECITE_VERSE: onStartGame(GameMode.RECITE_VERSE, currentReciteVerseDifficulty, selectedCategory); break;
        case GameMode.BOOK_SORT: onStartGame(GameMode.BOOK_SORT, currentBookSortDifficulty); break;
    }
  };

  const startButtonText = () => {
    if (disabled) return "Preparando...";
    return "Comenzar Juego";
  };

  const gameModeButtons = [
    { mode: GameMode.TRIVIA, label: "Trivia" },
    { mode: GameMode.MEMORY, label: "Memoria" },
    { mode: GameMode.ORDER_VERSE, label: "Orden Verso" },
    { mode: GameMode.RECITE_VERSE, label: "Recitar" },
    { mode: GameMode.BOOK_SORT, label: "Orden Libros" }
  ];
  
  const showCategory = selectedGameMode === GameMode.TRIVIA || selectedGameMode === GameMode.MEMORY || selectedGameMode === GameMode.ORDER_VERSE || selectedGameMode === GameMode.RECITE_VERSE;
  const showDifficulty = selectedGameMode === GameMode.MEMORY || selectedGameMode === GameMode.BOOK_SORT;

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 min-h-[520px] bg-white/30 backdrop-blur-md rounded-xl shadow-xl">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-700 mb-3 anim-fade-in-up">
        Desafío Bíblico
      </h1>
      <p className="text-lg text-gray-600 mb-6 sm:mb-8 anim-fade-in-up animation-delay-100">
        Elige tu juego y pon a prueba tu conocimiento.
      </p>

      <div className="w-full max-w-xs mb-6 space-y-5">
        <div className="anim-fade-in-up animation-delay-200">
          <label htmlFor="gamemode-select" className="block text-sm font-medium text-gray-600 mb-2 text-left">
            Modo de juego:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {gameModeButtons.map(({mode, label}) => (
              <Button
                key={mode}
                onClick={() => setSelectedGameMode(mode)}
                variant={selectedGameMode === mode ? 'primary' : 'secondary'}
                className={`w-full py-2.5 !rounded-lg text-xs sm:text-sm transition-colors duration-200 ${selectedGameMode === mode ? 'shadow-md' : 'hover:bg-amber-100/70'}`}
                disabled={disabled}
                aria-pressed={selectedGameMode === mode}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {showCategory && (
            <div className="anim-fade-in-up animation-delay-300">
              <label htmlFor="category-select" className="block text-sm font-medium text-gray-600 mb-2 text-left">
                Categoría:
              </label>
              <Dropdown
                id="category-select"
                options={categoryOptions}
                selectedValue={selectedCategory}
                onChange={setSelectedCategory}
                ariaLabel="Seleccionar categoría"
                disabled={disabled}
              />
            </div>
        )}

        {showDifficulty && (
          <div className="anim-fade-in-up animation-delay-400">
            <label htmlFor="difficulty-select" className="block text-sm font-medium text-gray-600 mb-2 text-left">
               {selectedGameMode === GameMode.BOOK_SORT ? 'Colección de Libros:' : 'Dificultad:'}
            </label>
            {selectedGameMode === GameMode.MEMORY && (
              <Dropdown options={memoryDifficultyOptions} selectedValue={currentMemoryDifficulty.level} onChange={handleMemoryDifficultyChange} disabled={disabled} />
            )}
            {selectedGameMode === GameMode.BOOK_SORT && (
              // Use index as value for the extended options
              <Dropdown 
                  options={bookSortDifficultyOptions} 
                  selectedValue={BOOK_SORT_OPTIONS_EXTENDED.indexOf(currentBookSortDifficulty)} 
                  onChange={(val) => handleBookSortDifficultyChange(Number(val))} 
                  disabled={disabled} 
              />
            )}
          </div>
        )}
      </div>

      <Button 
        onClick={handleStartClick}
        variant="primary"
        className="w-full max-w-xs text-lg mt-4 sm:mt-6 anim-fade-in-up animation-delay-500"
        aria-label={`Comenzar ${selectedGameMode}`}
        disabled={disabled}
      >
        {startButtonText()}
      </Button>
    </div>
  );
};

export default HomeScreen;
