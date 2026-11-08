import React, { useState, useEffect, useCallback } from 'react';
import { OrderVerseItem, OrderVerseDifficultySetting, GameEndPayload, OrderVerseGameEndPayload } from '../types';
import Button from './Button';
import ProgressBar from './ProgressBar';

// Defines a word object that includes its original index to handle repeated words correctly
interface WordToken {
  text: string;
  originalIndex: number; // To distinguish identical words
  id: string; // Unique ID for React key prop: `word-${originalIndex}`
}

const FEEDBACK_DELAY_MS = 2500; // Time to show feedback before auto-advancing on incorrect

const OrderVerseScreen: React.FC<{
  items: OrderVerseItem[];
  difficulty: OrderVerseDifficultySetting;
  onGameEnd: (results: GameEndPayload) => void;
  isTraining?: boolean;
  onScoreUpdate?: (score: number) => void;
}> = ({ items, difficulty, onGameEnd, isTraining = false, onScoreUpdate }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWordTokens, setSelectedWordTokens] = useState<WordToken[]>([]);
  const [availableWordTokens, setAvailableWordTokens] = useState<WordToken[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false); // To disable buttons during transition

  const [timeLeft, setTimeLeft] = useState(difficulty.timerPerItem || 0);
  const [timerId, setTimerId] = useState<number | null>(null);

  const currentItem = items[currentItemIndex];
  const totalItems = items.length;

  const handleFinishTraining = useCallback(() => {
    // Finish immediately with current stats
    const results: OrderVerseGameEndPayload = {
        type: 'order_verse',
        score: score, 
        versesAttempted: currentItemIndex + (isVerified ? 1 : 0), // Count current if verified
        versesCorrect: score, 
      };
      onGameEnd(results);
  }, [score, currentItemIndex, isVerified, onGameEnd]);

  const setupCurrentVerse = useCallback(() => {
    if (!currentItem) return;
    setSelectedWordTokens([]);
    setAvailableWordTokens(
      currentItem.words.map((word, index) => ({
        text: word,
        originalIndex: currentItem.correctWordOrder.findIndex((w, i) => w === word && !currentItem.words.slice(0, index).some((sw, si) => sw === word && currentItem.correctWordOrder.findIndex((cw,ci) => cw === sw) === i )),
        id: `word-${index}` 
      }))
    );
    setFeedback(null);
    setIsVerified(false);
    setIsLoadingNext(false);
    setTimeLeft(difficulty.timerPerItem || 0);
  }, [currentItem, difficulty.timerPerItem]);

  useEffect(() => {
    setupCurrentVerse();
  }, [currentItemIndex, items, setupCurrentVerse]);

  // Timer Effect
  useEffect(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }

    if (!isVerified && difficulty.timerPerItem && difficulty.timerPerItem > 0 && !isTraining && currentItem) {
      setTimeLeft(difficulty.timerPerItem); // Reset time for new item/attempt
      const newTimerId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(newTimerId);
            setTimerId(null);
            setIsVerified(true);
            setFeedback({ 
              message: `¡Se acabó el tiempo! El orden correcto era: "${currentItem.correctWordOrder.join(' ')}"`, 
              type: 'incorrect' 
            });
            setIsLoadingNext(false); // Enable "Continuar"
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setTimerId(newTimerId as unknown as number);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItemIndex, isVerified, difficulty.timerPerItem, currentItem]);


  const handleSelectWord = (tokenToSelect: WordToken) => {
    if (isVerified || isLoadingNext) return;
    setSelectedWordTokens(prev => [...prev, tokenToSelect]);
    setAvailableWordTokens(prev => prev.filter(token => token.id !== tokenToSelect.id));
  };

  const handleDeselectWord = (tokenToDeselect: WordToken) => {
    if (isVerified || isLoadingNext) return;
    setAvailableWordTokens(prev => [...prev, tokenToDeselect]); 
    setSelectedWordTokens(prev => prev.filter(token => token.id !== tokenToDeselect.id));
  };
  
  const handleVerifyOrder = () => {
    if (selectedWordTokens.length === 0 || isLoadingNext) return;
    setIsLoadingNext(true); 

    if (timerId) { // Clear active timer if user submits before timeout
      clearInterval(timerId);
      setTimerId(null);
    }

    const playerOrderText = selectedWordTokens.map(token => token.text).join(' ');
    const correctOrderText = currentItem.correctWordOrder.join(' ');

    if (playerOrderText === correctOrderText) {
      setScore(prev => {
        const newScore = prev + 1;
        if (onScoreUpdate) onScoreUpdate(newScore);
        return newScore;
      });
      setFeedback({ message: "¡Correcto!", type: 'correct' });
      setIsVerified(true);
      setTimeout(() => proceedToNextItem(true), 1200); 
    } else {
      setFeedback({ 
        message: `Incorrecto. El orden correcto era: "${correctOrderText}"`, 
        type: 'incorrect' 
      });
      setIsVerified(true); 
      setIsLoadingNext(false); 
    }
  };

  const proceedToNextItem = (wasCorrect: boolean) => {
    setIsLoadingNext(true);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    
    if (currentItemIndex < totalItems - 1) {
      setCurrentItemIndex(prev => prev + 1);
      // setupCurrentVerse will be called by useEffect
    } else {
      // Game End
      const finalPayload: OrderVerseGameEndPayload = {
        type: 'order_verse',
        score: score, 
        versesAttempted: totalItems,
        versesCorrect: score, 
      };
      onGameEnd(finalPayload);
    }
  };


  if (!currentItem) {
    return <div className="text-center p-8 text-gray-700">Cargando desafío de orden...</div>;
  }

  const itemNumber = currentItemIndex + 1;

  return (
    <div className="flex flex-col min-h-[550px] justify-between relative pt-24 pb-6 bg-white/30 backdrop-blur-md rounded-xl shadow-xl">
      {/* Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 py-3 bg-white/80 backdrop-blur-sm shadow-md z-20 rounded-t-xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-700 mb-1">
             <div className="flex items-center gap-2">
                <p id="item-counter" className="font-semibold">
                    {isTraining ? `Ítem: ${itemNumber}` : `Ítem: ${itemNumber} de ${totalItems}`}
                </p>
                {isTraining && (
                    <button 
                        id="finish-training-btn"
                        onClick={handleFinishTraining}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 font-bold"
                    >
                        Terminar
                    </button>
                )}
            </div>
            <p id="score-counter" className="font-semibold text-blue-600">Puntaje: {score}</p>
            {difficulty.timerPerItem && difficulty.timerPerItem > 0 && !isTraining && (
              <p id="timer-display" className={`font-semibold ${timeLeft <= 5 && timeLeft > 0 && !isVerified ? 'text-red-500 anim-pulse' : 'text-gray-600'}`}>
                Tiempo: {timeLeft}s
              </p>
            )}
          </div>
          {!isTraining && <ProgressBar current={itemNumber} total={totalItems} />}
        </div>
      </div>
      
      {/* Game Area */}
      <div className="px-3 sm:px-5 flex-grow flex flex-col items-center">
        <p className="text-center text-lg font-semibold text-gray-700 mt-2 mb-3">
          Ordena el versículo: <span className="font-bold text-amber-600">{currentItem.reference}</span>
        </p>

        {/* Selected Words Area (Top) */}
        <div 
          className="w-full min-h-[100px] sm:min-h-[120px] bg-white/50 border-2 border-dashed border-amber-400 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2 content-start"
          aria-label="Área de palabras seleccionadas"
        >
          {selectedWordTokens.map((token) => (
            <button
              key={token.id}
              onClick={() => handleDeselectWord(token)}
              disabled={isVerified || isLoadingNext}
              className="bg-sky-500 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base rounded-md shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {token.text}
            </button>
          ))}
          {selectedWordTokens.length === 0 && !isVerified && (
            <p className="text-gray-400 text-sm italic self-center mx-auto">Selecciona palabras de abajo.</p>
          )}
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`w-full p-2.5 sm:p-3 mb-3 text-center rounded-md shadow-md text-sm sm:text-base anim-fade-in ${feedback.type === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="alert"
          >
            {feedback.message}
          </div>
        )}

        {/* Available Words Area (Bottom) */}
        {!isVerified && (
          <div 
            className="w-full min-h-[120px] sm:min-h-[150px] bg-white/40 border-2 border-gray-300 rounded-lg p-2 sm:p-3 mb-4 flex flex-wrap gap-1.5 sm:gap-2 content-start justify-center"
            aria-label="Área de palabras disponibles para seleccionar"
            >
            {availableWordTokens.map((token) => (
              <button
                key={token.id}
                onClick={() => handleSelectWord(token)}
                disabled={isLoadingNext}
                className="bg-amber-400 text-gray-800 px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base rounded-md shadow hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {token.text}
              </button>
            ))}
            {availableWordTokens.length === 0 && selectedWordTokens.length > 0 && (
                 <p className="text-gray-400 text-sm italic self-center mx-auto">¡Todas las palabras usadas! Verifica tu orden.</p>
            )}
             {availableWordTokens.length === 0 && selectedWordTokens.length === 0 && ( // Should not happen if item has words
                 <p className="text-gray-400 text-sm italic self-center mx-auto">No hay palabras disponibles.</p>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-3 sm:px-5 mt-auto">
        {isVerified ? (
          <Button
            onClick={() => proceedToNextItem(feedback?.type === 'correct')}
            variant="primary"
            className="w-full text-lg"
            disabled={isLoadingNext}
            aria-label={currentItemIndex < totalItems -1 ? "Siguiente versículo" : "Ver resultados finales"}
          >
            {isLoadingNext ? "Cargando..." : (currentItemIndex < totalItems - 1 ? (feedback?.type === 'correct' ? "Siguiente" : "Continuar") : "Finalizar")}
          </Button>
        ) : (
          <Button
            onClick={handleVerifyOrder}
            variant="primary"
            className="w-full text-lg"
            disabled={selectedWordTokens.length === 0 || isLoadingNext}
            aria-label="Verificar el orden de las palabras seleccionadas"
          >
            {isLoadingNext ? "Verificando..." : "Verificar Orden"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderVerseScreen;