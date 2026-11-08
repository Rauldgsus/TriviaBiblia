
import React, { useState, useEffect } from 'react';
import { BookData, BookSortDifficultySetting, GameEndPayload, BookSortGameEndPayload } from '../types';
import Button from './Button';
import ProgressBar from './ProgressBar';

interface BookSortGameScreenProps {
  books: BookData[];
  difficulty: BookSortDifficultySetting;
  onGameEnd: (results: GameEndPayload) => void;
  onNextLevel: (score: number) => void; // Callback for proceeding
  accumulatedScore?: number;
  isTraining?: boolean;
}

const BookSortGameScreen: React.FC<BookSortGameScreenProps> = ({ 
  books, 
  difficulty, 
  onGameEnd, 
  onNextLevel,
  accumulatedScore = 0,
  isTraining = false 
}) => {
  const [correctOrderBooks, setCorrectOrderBooks] = useState<BookData[]>([]);
  const [availableBooks, setAvailableBooks] = useState<BookData[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<BookData[]>([]);
  
  const [lastSelectedBook, setLastSelectedBook] = useState<BookData | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    // 1. Determine Correct Order
    let sorted = [...books];
    if (difficulty.criteria === 'ALPHABETICAL') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (difficulty.criteria === 'CHRONOLOGICAL') {
        sorted.sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
    } else { // CANONICAL
        sorted.sort((a, b) => a.canonicalOrder - b.canonicalOrder);
    }
    setCorrectOrderBooks(sorted);

    // 2. Shuffle for bank
    const shuffled = [...books];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAvailableBooks(shuffled);
    setSelectedBooks([]);
    setLastSelectedBook(null);
    setFeedback(null);
    
    // Do not reset mistakes here if we want to track across session, 
    // but typically mistakes are per level. Resetting here.
    setMistakes(0);

  }, [books, difficulty]);


  const handleSelectFromBank = (book: BookData) => {
    if (feedback?.type === 'success') return; // Locked if won
    
    setAvailableBooks(prev => prev.filter(b => b.id !== book.id));
    setSelectedBooks(prev => [...prev, book]);
    setLastSelectedBook(book);
    setFeedback(null);
  };

  const handleRemoveFromShelf = (book: BookData) => {
    if (feedback?.type === 'success') return;
    
    setSelectedBooks(prev => prev.filter(b => b.id !== book.id));
    setAvailableBooks(prev => [...prev, book]);
    setLastSelectedBook(book); // Update info panel to show what was just removed/clicked
  };

  const resetRound = () => {
    // Move all selected back to available and shuffle
    const allBooks = [...selectedBooks, ...availableBooks];
    // Shuffle
    for (let i = allBooks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allBooks[i], allBooks[j]] = [allBooks[j], allBooks[i]];
    }
    setAvailableBooks(allBooks);
    setSelectedBooks([]);
    setFeedback(null);
    setLastSelectedBook(null);
  };

  const handleVerify = () => {
    const isCorrect = selectedBooks.every((book, index) => book.id === correctOrderBooks[index].id);

    if (isCorrect) {
        setFeedback({ message: "¡Correcto!", type: 'success' });
        // Proceed to next level after delay
        setTimeout(() => {
            // Calculate score for this level (e.g., 10 points - mistakes)
            const levelScore = Math.max(0, 10 - mistakes); 
            onNextLevel(levelScore);
        }, 1200);
    } else {
        setMistakes(prev => prev + 1);
        setFeedback({ message: "Orden incorrecto. Inténtalo de nuevo.", type: 'error' });
        // Shuffle and restart after delay
        setTimeout(() => {
            resetRound();
        }, 1500);
    }
  };

  return (
    <div className="flex flex-col min-h-[600px] w-full pt-4 pb-4 bg-white/30 backdrop-blur-md rounded-xl shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="w-full px-4 mb-4 flex justify-between items-center text-gray-700">
         <div>
            <span className="font-bold text-amber-700 block text-sm sm:text-base">{difficulty.label}</span>
            <span className="text-xs text-gray-500">Puntaje Total: {accumulatedScore}</span>
         </div>
         {!isTraining && <ProgressBar current={selectedBooks.length} total={books.length} />}
      </div>

      {/* Top Shelf (Sequence) */}
      <div className="w-full px-2 sm:px-4 mb-2">
         <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-4 min-h-[140px] items-end">
            {/* Render slots for ALL books (filled + empty) */}
            {Array.from({ length: books.length }).map((_, index) => {
                const book = selectedBooks[index];
                return (
                    <div 
                        key={index} 
                        className={`
                            flex-shrink-0 w-16 h-24 sm:w-20 sm:h-32 rounded flex items-center justify-center text-center p-1 transition-all duration-300 relative
                            ${book ? 'bg-amber-700 text-amber-50 shadow-md cursor-pointer hover:bg-amber-600' : 'border-2 border-dashed border-gray-300 bg-white/40'}
                            ${feedback?.type === 'error' && book ? 'bg-red-500' : ''}
                            ${feedback?.type === 'success' && book ? 'bg-green-600' : ''}
                        `}
                        onClick={() => book ? handleRemoveFromShelf(book) : null}
                    >
                        {book ? (
                            <>
                                <span className="text-[10px] sm:text-xs font-serif font-bold leading-tight line-clamp-3">{book.name}</span>
                                {/* Small index indicator */}
                                <span className="absolute -bottom-5 text-[10px] text-gray-500 font-mono">#{index + 1}</span>
                            </>
                        ) : (
                             <span className="text-gray-300 font-bold text-xl">+</span>
                        )}
                    </div>
                );
            })}
         </div>
         {/* Shelf graphic */}
         <div className="h-2 w-full bg-amber-800/80 rounded-full shadow-sm mt-[-8px]"></div>
      </div>

      {/* Info Panel (Middle) */}
      <div className="px-4 mb-4">
          <div className="bg-white/60 rounded-xl p-4 shadow-sm border border-white/50 min-h-[100px] flex flex-col justify-center items-center text-center transition-all">
             {lastSelectedBook ? (
                 <div className="anim-fade-in">
                     <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-800 mb-1">{lastSelectedBook.name}</h3>
                     <p className="text-xs text-gray-500 mb-2">{lastSelectedBook.testament === 'Old' ? 'A.T.' : 'N.T.'} • {lastSelectedBook.author} • {lastSelectedBook.chapters} caps.</p>
                     <p className="text-sm text-gray-700 italic leading-snug">"{lastSelectedBook.summary}"</p>
                 </div>
             ) : (
                 <p className="text-gray-400 italic text-sm">Selecciona un libro para ver su información y ordenarlo.</p>
             )}
          </div>
      </div>

      {/* Feedback Overlay/Message */}
      {feedback && (
          <div className={`mx-4 mb-2 p-2 rounded text-center font-bold text-sm sm:text-base anim-fade-in ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback.message}
          </div>
      )}

      {/* Bottom Bank (Available Books) */}
      <div className="flex-grow bg-white/40 rounded-t-2xl shadow-inner p-4 overflow-y-auto">
         <p className="text-center text-xs text-gray-500 mb-3">Libros Disponibles</p>
         <div className="flex flex-wrap justify-center gap-2 pb-16">
             {availableBooks.map(book => (
                 <button
                    key={book.id}
                    onClick={() => handleSelectFromBank(book)}
                    className="w-20 h-10 sm:w-24 sm:h-12 bg-amber-100 border border-amber-300 rounded text-amber-900 text-xs sm:text-sm font-semibold shadow-sm hover:bg-amber-200 active:scale-95 transition-all flex items-center justify-center px-1"
                 >
                     <span className="line-clamp-2 leading-none">{book.name}</span>
                 </button>
             ))}
             {availableBooks.length === 0 && !feedback && (
                 <p className="text-gray-400 italic text-sm mt-4">Todos los libros colocados.</p>
             )}
         </div>
      </div>

      {/* Footer / Verify Button */}
      <div className="absolute bottom-0 w-full p-4 bg-white/90 backdrop-blur border-t border-gray-200">
         <Button 
            onClick={handleVerify} 
            variant="primary" 
            className="w-full shadow-lg"
            disabled={selectedBooks.length !== books.length || feedback !== null}
         >
             {feedback?.type === 'success' ? "Continuando..." : "Verificar Orden"}
         </Button>
      </div>

    </div>
  );
};

export default BookSortGameScreen;
