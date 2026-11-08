import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReciteVerseItem, ReciteVerseDifficultySetting, GameEndPayload, ReciteVerseGameEndPayload, VisibleLettersMode } from '../types';
import Button from './Button';
import ProgressBar from './ProgressBar';

const FEEDBACK_AUTO_ADVANCE_MS = 2500; // Time to show feedback before auto-advancing (if correct)

interface CharInputProps {
  char: string;
  wordIndex: number;
  letterIndex: number;
  value: string;
  onChange: (wordIndex: number, letterIndex: number, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, wordIndex: number, letterIndex: number) => void;
  isFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  disabled: boolean;
  visibleLettersMode: VisibleLettersMode;
  isFirstLetter: boolean;
  isLastLetter: boolean;
}

const CharInput: React.FC<CharInputProps> = ({
  char, wordIndex, letterIndex, value, onChange, onKeyDown, isFocused, inputRef, disabled,
  visibleLettersMode, isFirstLetter, isLastLetter
}) => {
  let displayChar: string | null = null;
  // let isInputDisabled = disabled; // This was here, but disabled prop already handles it

  if (visibleLettersMode === 'firstAndLast') {
    if (isFirstLetter || isLastLetter) displayChar = char;
  } else if (visibleLettersMode === 'firstOnly') {
    if (isFirstLetter) displayChar = char;
  }
  
  const isEffectivelyFixed = displayChar !== null;

  useEffect(() => {
    if (isFocused && inputRef.current && !isEffectivelyFixed) {
      inputRef.current.focus();
    }
  }, [isFocused, inputRef, isEffectivelyFixed]);

  if (isEffectivelyFixed) {
    return (
      <span className="w-6 h-8 sm:w-7 sm:h-9 md:w-8 md:h-10 flex items-center justify-center bg-gray-200/70 border border-gray-300 rounded text-sm sm:text-base font-medium text-gray-700 select-none">
        {displayChar}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(wordIndex, letterIndex, e.target.value)}
      onKeyDown={(e) => onKeyDown(e, wordIndex, letterIndex)}
      disabled={disabled} // Use the passed disabled prop directly
      className="w-6 h-8 sm:w-7 sm:h-9 md:w-8 md:h-10 text-center border border-gray-400 rounded focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm sm:text-base font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      aria-label={`Letra ${letterIndex + 1} de la palabra ${wordIndex + 1}`}
    />
  );
};


const ReciteVerseScreen: React.FC<{
  items: ReciteVerseItem[];
  difficultySettings: ReciteVerseDifficultySetting;
  onGameEnd: (results: GameEndPayload) => void;
  isTraining?: boolean;
  onScoreUpdate?: (score: number) => void;
}> = ({ items, difficultySettings, onGameEnd, isTraining = false, onScoreUpdate }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userInputWords, setUserInputWords] = useState<string[][]>([]);
  const [focusCoordinates, setFocusCoordinates] = useState<{ wordIndex: number; letterIndex: number } | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const [timeLeft, setTimeLeft] = useState(difficultySettings.timerPerItem || 0);
  const [timerId, setTimerId] = useState<number | null>(null);

  const inputRefs = useRef<Array<Array<React.RefObject<HTMLInputElement> | null>>>([]);

  const currentItem = items[currentItemIndex];
  const totalItems = items.length;

  const handleFinishTraining = useCallback(() => {
    // Finish immediately with current stats
    const results: ReciteVerseGameEndPayload = {
        type: 'recite_verse',
        score: score, 
        versesAttempted: currentItemIndex + (isVerified ? 1 : 0),
        versesCorrect: score, 
      };
      onGameEnd(results);
  }, [score, currentItemIndex, isVerified, onGameEnd]);

  const initializeInputsAndFocus = useCallback(() => {
    if (!currentItem) return;
    const newUserInputWords = currentItem.words.map(word => Array(word.length).fill(''));
    setUserInputWords(newUserInputWords);

    inputRefs.current = currentItem.words.map(word =>
      Array(word.length).fill(null).map(() => React.createRef<HTMLInputElement>())
    );
    
    let firstEditableFocus: { wordIndex: number; letterIndex: number } | null = null;
    for (let wIdx = 0; wIdx < currentItem.words.length; wIdx++) {
      for (let lIdx = 0; lIdx < currentItem.words[wIdx].length; lIdx++) {
        const word = currentItem.words[wIdx];
        const isFirst = lIdx === 0;
        const isLast = lIdx === word.length - 1;
        let isFixed = false;
        if (difficultySettings.visibleLettersMode === 'firstAndLast' && (isFirst || isLast)) isFixed = true;
        if (difficultySettings.visibleLettersMode === 'firstOnly' && isFirst) isFixed = true;
        
        if (!isFixed) {
          firstEditableFocus = { wordIndex: wIdx, letterIndex: lIdx };
          break;
        }
      }
      if (firstEditableFocus) break;
    }
    setFocusCoordinates(firstEditableFocus);
    setFeedback(null);
    setIsVerified(false);
    setIsLoadingNext(false);
    setTimeLeft(difficultySettings.timerPerItem || 0);
  }, [currentItem, difficultySettings.visibleLettersMode, difficultySettings.timerPerItem]);

  useEffect(() => {
    initializeInputsAndFocus();
  }, [currentItemIndex, items, initializeInputsAndFocus]);

  // Timer Effect
  useEffect(() => {
    if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
    }

    if (!isVerified && difficultySettings.timerPerItem && difficultySettings.timerPerItem > 0 && !isTraining && currentItem) {
        setTimeLeft(difficultySettings.timerPerItem);
        const newTimerId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(newTimerId);
                    setTimerId(null);
                    setIsVerified(true);
                    setFeedback({ 
                        message: `¡Se acabó el tiempo! El texto correcto es: "${currentItem.fullText}"`, 
                        type: 'incorrect' 
                    });
                    setIsLoadingNext(false);
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
  }, [currentItemIndex, isVerified, difficultySettings.timerPerItem, currentItem]);


  const moveToFocus = (wordIdx: number, letterIdx: number, direction: 'next' | 'prev') => {
    if (!currentItem) return;
    
    const findNextEditable = (w: number, l: number): { wordIndex: number; letterIndex: number } | null => {
      let currentW = w;
      let currentL = l + 1; // Start checking from next position

      for (let wIdx = currentW; wIdx < currentItem.words.length; wIdx++) {
        const word = currentItem.words[wIdx];
        // If starting a new word, reset letter index
        if (wIdx > currentW) currentL = 0; 

        for (let lIdx = currentL; lIdx < word.length; lIdx++) {
          const isFirst = lIdx === 0;
          const isLast = lIdx === word.length - 1;
          let isFixed = false;
          if (difficultySettings.visibleLettersMode === 'firstAndLast' && (isFirst || isLast)) isFixed = true;
          if (difficultySettings.visibleLettersMode === 'firstOnly' && isFirst) isFixed = true;
          if (!isFixed) return { wordIndex: wIdx, letterIndex: lIdx };
        }
        currentL = 0; // Ensure next word starts from 0
      }
      return null; 
    };

    const findPrevEditable = (w: number, l: number): { wordIndex: number; letterIndex: number } | null => {
      let currentW = w;
      let currentL = l - 1; // Start checking from previous position

      for (let wIdx = currentW; wIdx >= 0; wIdx--) {
        const word = currentItem.words[wIdx];
         // If starting a new word (moving backwards), set letter index to end of that word
        if (wIdx < currentW) currentL = currentItem.words[wIdx].length - 1;

        for (let lIdx = currentL; lIdx >= 0; lIdx--) {
          const isFirst = lIdx === 0;
          const isLast = lIdx === word.length - 1;
          let isFixed = false;
          if (difficultySettings.visibleLettersMode === 'firstAndLast' && (isFirst || isLast)) isFixed = true;
          if (difficultySettings.visibleLettersMode === 'firstOnly' && isFirst) isFixed = true;
          if (!isFixed) return { wordIndex: wIdx, letterIndex: lIdx };
        }
        currentL = -1; // Ensure prev word checks from its end
      }
      return null; 
    };

    if (direction === 'next') {
      const nextFocus = findNextEditable(wordIdx, letterIdx);
      if (nextFocus) setFocusCoordinates(nextFocus);
    } else { // prev
      const prevFocus = findPrevEditable(wordIdx, letterIdx);
      if (prevFocus) setFocusCoordinates(prevFocus);
    }
  };

  const handleInputChange = (wordIdx: number, letterIdx: number, value: string) => {
    if (isVerified || isLoadingNext) return;
    const char = value.slice(-1).toLowerCase(); // Normalize to lowercase for consistency
    setUserInputWords(prev => {
      const newInputs = prev.map(wordArr => [...wordArr]);
      newInputs[wordIdx][letterIdx] = char;
      return newInputs;
    });
    if (char) { 
      moveToFocus(wordIdx, letterIdx, 'next');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, wordIdx: number, letterIdx: number) => {
    if (isVerified || isLoadingNext) return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      const currentVal = userInputWords[wordIdx][letterIdx];
      setUserInputWords(prev => {
        const newInputs = prev.map(wordArr => [...wordArr]);
        newInputs[wordIdx][letterIdx] = ''; 
        return newInputs;
      });
      if (!currentVal) { 
        moveToFocus(wordIdx, letterIdx, 'prev');
      } else { 
        setFocusCoordinates({ wordIndex: wordIdx, letterIndex: letterIdx }); 
      }
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveToFocus(wordIdx, letterIdx, 'prev');
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveToFocus(wordIdx, letterIdx, 'next');
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!isVerified) verifyVerse();
    }
  };
  
  const verifyVerse = () => {
    if (isLoadingNext || isVerified) return;
    setIsLoadingNext(true);

    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }

    const userAnswer = userInputWords.map(wordArr => wordArr.join('')).join(' ').trim();
    const correctAnswer = currentItem.fullText.trim();
    
    // Normalize by removing punctuation for comparison, then compare lowercase
    const normalizeText = (text: string) => 
        text.toLowerCase().replace(/[.,;:!?"'-]/g, '').replace(/\s+/g, ' ');

    const normalizedUserAnswer = normalizeText(userAnswer);
    const normalizedCorrectAnswer = normalizeText(correctAnswer);

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      setScore(prev => {
        const newScore = prev + 1;
        if (onScoreUpdate) onScoreUpdate(newScore);
        return newScore;
      });
      setFeedback({ message: "¡Correcto!", type: 'correct' });
      setIsVerified(true);
      setTimeout(() => proceedToNextItem(true), FEEDBACK_AUTO_ADVANCE_MS);
    } else {
      setFeedback({ message: `Incorrecto. El texto correcto es: "${correctAnswer}"`, type: 'incorrect' });
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
      // initializeInputsAndFocus will be called by useEffect
    } else {
      const finalPayload: ReciteVerseGameEndPayload = {
        type: 'recite_verse',
        score: score, 
        versesAttempted: totalItems,
        versesCorrect: score, 
      };
      onGameEnd(finalPayload);
    }
  };

  if (!currentItem || userInputWords.length === 0) {
    return <div className="text-center p-8 text-gray-700">Cargando desafío de recitación...</div>;
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
            {difficultySettings.timerPerItem && difficultySettings.timerPerItem > 0 && !isTraining && (
              <p id="timer-display" className={`font-semibold ${timeLeft <= 5 && timeLeft > 0 && !isVerified ? 'text-red-500 anim-pulse' : 'text-gray-600'}`}>
                Tiempo: {timeLeft}s
              </p>
            )}
          </div>
          {!isTraining && <ProgressBar current={itemNumber} total={totalItems} />}
        </div>
      </div>
      
      {/* Game Area */}
      <div className="px-3 sm:px-5 flex-grow flex flex-col items-center w-full">
        <p className="text-center text-lg font-semibold text-gray-700 mt-2 mb-4">
          Recita el versículo: <span className="font-bold text-amber-600">{currentItem.reference}</span>
        </p>

        {/* Verse Input Area */}
        <div className="w-full bg-white/50 p-3 sm:p-4 rounded-lg shadow flex flex-wrap justify-center gap-x-1.5 sm:gap-x-2 gap-y-2 mb-4"
             aria-label="Área de entrada del versículo">
          {currentItem.words.map((word, wordIdx) => (
            <div key={`word-${wordIdx}`} className="flex items-center gap-px sm:gap-0.5">
              {word.split('').map((char, letterIdx) => (
                <CharInput
                  key={`char-${wordIdx}-${letterIdx}`}
                  char={char}
                  wordIndex={wordIdx}
                  letterIndex={letterIdx}
                  value={userInputWords[wordIdx]?.[letterIdx] || ''}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  isFocused={focusCoordinates?.wordIndex === wordIdx && focusCoordinates?.letterIndex === letterIdx}
                  inputRef={inputRefs.current[wordIdx]?.[letterIdx]!}
                  disabled={isVerified || isLoadingNext}
                  visibleLettersMode={difficultySettings.visibleLettersMode}
                  isFirstLetter={letterIdx === 0}
                  isLastLetter={letterIdx === word.length - 1}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`w-full p-2.5 sm:p-3 mb-3 text-center rounded-md shadow-md text-sm sm:text-base anim-fade-in ${feedback.type === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="alert"
          >
            {feedback.message}
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
            onClick={verifyVerse}
            variant="primary"
            className="w-full text-lg"
            disabled={isLoadingNext}
            aria-label="Verificar el versículo recitado"
          >
            {isLoadingNext ? "Verificando..." : "Verificar Versículo"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReciteVerseScreen;