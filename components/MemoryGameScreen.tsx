import React, { useState, useEffect, useCallback } from 'react';
import { MemoryCardData, MemoryDifficultySetting, GameEndPayload } from '../types';
import MemoryCard from './MemoryCard';
import Button from './Button'; // For a potential "Quit" button

const MISMATCH_DELAY_MS = 1000;

interface MemoryGameScreenProps {
  cards: MemoryCardData[];
  difficulty: MemoryDifficultySetting;
  onGameEnd: (results: GameEndPayload) => void;
  isTraining?: boolean;
}

const MemoryGameScreen: React.FC<MemoryGameScreenProps> = ({ cards, difficulty, onGameEnd, isTraining = false }) => {
  const [gameCards, setGameCards] = useState<MemoryCardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [isChecking, setIsChecking] = useState(false); // To prevent clicks during pair check or mismatch delay
  const [gridColsClass, setGridColsClass] = useState('grid-cols-4'); // Default

  useEffect(() => {
    // Initialize game cards based on props
    setGameCards(cards.map(card => ({ ...card, isFlipped: false, isMatched: false })));
    setFlippedIndices([]);
    setMoves(0);
    setPairsFound(0);
    setIsChecking(false);

    // Set grid columns based on difficulty
    // Tailwind needs full class names, so we can't just do `grid-cols-${difficulty.grid.cols}` directly in className
    switch (difficulty.grid.cols) {
        case 3: setGridColsClass('grid-cols-3'); break;
        case 4: setGridColsClass('grid-cols-4'); break;
        case 5: setGridColsClass('grid-cols-5'); break;
        case 6: setGridColsClass('grid-cols-6'); break;
        default: setGridColsClass('grid-cols-4'); // Fallback
    }

  }, [cards, difficulty]);

  const handleFinishTraining = () => {
      onGameEnd({ type: 'memory', moves, totalPairs: pairsFound }); // Report what has been found so far
  };

  const handleCardFlipAttempt = (index: number) => { // Renamed from handleCardClick for clarity, as it's passed to MemoryCard
    if (isChecking || gameCards[index].isFlipped || gameCards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    setGameCards(prevCards =>
      prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );

    if (newFlippedIndices.length === 2) {
      setIsChecking(true); // Start checking phase
      setMoves(prevMoves => prevMoves + 1);
      // Check for match after a short delay to allow flip animation
      setTimeout(checkForMatch, 500, newFlippedIndices);
    }
  };
  
  const checkForMatch = useCallback((indicesToCheck: number[]) => {
    const [firstIndex, secondIndex] = indicesToCheck;
    const card1 = gameCards[firstIndex];
    const card2 = gameCards[secondIndex];

    if (card1.pairId === card2.pairId) {
      // Match found
      setGameCards(prevCards =>
        prevCards.map(card =>
          card.pairId === card1.pairId ? { ...card, isMatched: true, isFlipped: true } : card
        )
      );
      setPairsFound(prevPairs => {
        const newPairsFound = prevPairs + 1;
        if (newPairsFound === difficulty.pairs) {
          // Game Over
          setTimeout(() => { // Delay slightly to show final match
            onGameEnd({ type: 'memory', moves, totalPairs: difficulty.pairs });
          }, 500);
        }
        return newPairsFound;
      });
      setFlippedIndices([]);
      setIsChecking(false); // End checking phase
    } else {
      // No match
      setTimeout(() => {
        setGameCards(prevCards =>
          prevCards.map((card, i) =>
            i === firstIndex || i === secondIndex ? { ...card, isFlipped: false } : card
          )
        );
        setFlippedIndices([]);
        setIsChecking(false); // End checking phase
      }, MISMATCH_DELAY_MS);
    }
  }, [gameCards, difficulty.pairs, onGameEnd, moves]);


  if (gameCards.length === 0) {
    return <div className="text-center p-8 text-gray-700">Cargando juego de memoria...</div>;
  }

  return (
    <div className="flex flex-col min-h-[500px] justify-start relative p-4 bg-white/30 backdrop-blur-md rounded-xl shadow-xl">
      <div className="w-full mb-4 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow sticky top-0 z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex justify-between items-center text-sm sm:text-base text-gray-700 w-full sm:w-auto gap-4">
          <p className="font-semibold">Movimientos: <span className="text-amber-600">{moves}</span></p>
          <p className="font-semibold">Pares Encontrados: <span className="text-green-600">{pairsFound}</span> / {difficulty.pairs}</p>
        </div>
        {isTraining && (
            <button 
                onClick={handleFinishTraining}
                className="text-xs sm:text-sm bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold shadow-sm transition-colors"
            >
                Terminar Entrenamiento
            </button>
        )}
      </div>

      <div className={`grid ${gridColsClass} gap-2 sm:gap-3 flex-grow`}>
        {gameCards.map((card, index) => (
          <MemoryCard
            key={card.id}
            card={card}
            onAttemptFlip={() => handleCardFlipAttempt(index)}
            isGameInteractionDisabled={isChecking && !card.isFlipped} // Disable non-flipped cards during check for game interaction
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryGameScreen;