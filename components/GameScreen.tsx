import React, { useState, useEffect, useCallback } from 'react';
import { TriviaQuestion, SelectedAnswerInfo, GameEndPayload, TriviaGameEndPayload } from '../types';
import Button from './Button';
import ProgressBar from './ProgressBar';

const FEEDBACK_DISPLAY_TIME_MS = 1800;
const TIMEOUT_SELECTED_INDEX = -1; // Special index to denote a timeout

interface GameScreenProps {
  questions: TriviaQuestion[];
  onGameEnd: (results: GameEndPayload) => void; 
  timerDuration: number; 
  isTraining?: boolean;
  onScoreUpdate?: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ questions, onGameEnd, timerDuration, isTraining = false, onScoreUpdate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [netScore, setNetScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [selectedAnswerInfo, setSelectedAnswerInfo] = useState<SelectedAnswerInfo | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionContainerClass, setQuestionContainerClass] = useState('anim-fade-in');
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [timerId, setTimerId] = useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleFinishTraining = useCallback(() => {
    // Finish immediately with current stats
    // We treat 'totalQuestions' as 'questions answered so far' for the report
    const results: TriviaGameEndPayload = {
        type: 'trivia',
        netScore,
        correctAnswersCount,
        totalQuestions: currentQuestionIndex + (isAnswered ? 1 : 0), // Count current if answered
      };
      onGameEnd(results);
  }, [netScore, correctAnswersCount, currentQuestionIndex, isAnswered, onGameEnd]);

  const proceedToNextPhase = useCallback(() => {
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        const results: TriviaGameEndPayload = {
          type: 'trivia',
          netScore,
          correctAnswersCount,
          totalQuestions: questions.length,
        };
        onGameEnd(results);
      }
    }, FEEDBACK_DISPLAY_TIME_MS);
  }, [currentQuestionIndex, questions.length, onGameEnd, netScore, correctAnswersCount]);

  const processAnswer = useCallback((
    optionIndex: number, // Use TIMEOUT_SELECTED_INDEX for timeout
    isTimeoutFlag: boolean = false
  ) => {
    if (isAnswered) return;

    if (timerId !== null) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setIsAnswered(true);

    const correctOptionIndex = currentQuestion.options.findIndex(opt => opt.isCorrect);
    let isCorrectOptionClicked = false;
    let currentScore = netScore;
    let currentCorrectAnswers = correctAnswersCount;

    if (isTimeoutFlag) {
      currentScore -= 1; // Penalty for timeout
      // isCorrectOptionClicked remains false
    } else {
      isCorrectOptionClicked = currentQuestion.options[optionIndex].isCorrect;
      if (isCorrectOptionClicked) {
        currentScore += 1; // Point for correct answer
        currentCorrectAnswers += 1;
      } else {
        // No change to netScore for incorrect click, only no point gained
      }
    }
    setNetScore(currentScore);
    setCorrectAnswersCount(currentCorrectAnswers);
    if (onScoreUpdate) onScoreUpdate(currentCorrectAnswers);

    if (!isCorrectOptionClicked && !isTimeoutFlag) { // Shake if clicked wrong
        setQuestionContainerClass('anim-shake');
    } else if (isTimeoutFlag) { // Also shake on timeout to indicate an "incorrect" outcome
        setQuestionContainerClass('anim-shake');
    }
    
    setSelectedAnswerInfo({
      isCorrectResponse: isCorrectOptionClicked, 
      selectedIndex: isTimeoutFlag ? TIMEOUT_SELECTED_INDEX : optionIndex,
      correctIndex: correctOptionIndex,
      isTimeout: isTimeoutFlag,
    });

    proceedToNextPhase();

  }, [currentQuestion, isAnswered, netScore, correctAnswersCount, timerId, proceedToNextPhase]);


  // Effect for managing the timer
  useEffect(() => {
    if (!isAnswered && timerDuration > 0 && !isTraining && currentQuestion) { 
      setTimeLeft(timerDuration); 
      const newTimerId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(newTimerId);
            processAnswer(TIMEOUT_SELECTED_INDEX, true); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setTimerId(newTimerId as unknown as number); 

      return () => { 
        if (newTimerId) clearInterval(newTimerId);
      };
    } else if (isAnswered && timerId !== null) { 
        clearInterval(timerId);
        setTimerId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, isAnswered, timerDuration, currentQuestion]);


  // Effect to reset state for new question
  useEffect(() => {
    setSelectedAnswerInfo(null);
    setIsAnswered(false);
    setQuestionContainerClass('anim-fade-in');
    setTimeLeft(timerDuration); 
    
    if (timerId !== null) {
        clearInterval(timerId);
        setTimerId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, timerDuration]);


  if (!currentQuestion) {
    return <div className="text-center p-8 text-gray-700">Cargando pregunta...</div>;
  }

  const getButtonVariant = (index: number): 'correct' | 'incorrect' | 'option' => {
    if (!selectedAnswerInfo) return 'option';
    
    // If the selection was a timeout
    if (selectedAnswerInfo.isTimeout) {
      if (index === selectedAnswerInfo.correctIndex) return 'correct'; // Show correct answer on timeout
      return 'option'; // Other options remain normal but disabled
    }

    // If the user made a selection
    if (index === selectedAnswerInfo.selectedIndex) {
      return selectedAnswerInfo.isCorrectResponse ? 'correct' : 'incorrect';
    }
    // If user chose incorrectly, also highlight the correct answer
    if (!selectedAnswerInfo.isCorrectResponse && index === selectedAnswerInfo.correctIndex) {
      return 'correct';
    }
    return 'option';
  };
  
  const questionNumber = currentQuestionIndex + 1;

  return (
    <div className="flex flex-col min-h-[500px] justify-between relative pb-8 pt-28 bg-white/30 backdrop-blur-md rounded-xl shadow-xl">
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl p-4 bg-white/80 backdrop-blur-sm shadow-md z-10 rounded-t-xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center text-sm text-gray-700 mb-1">
            <div className="flex items-center gap-2">
                <p id="question-counter" className="font-semibold">
                    {isTraining ? `Pregunta: ${questionNumber}` : `Pregunta: ${questionNumber} de ${totalQuestions}`}
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
            <p id="score-counter" className="font-semibold text-blue-600">Puntaje Neto: {netScore}</p>
            {timerDuration > 0 && !isTraining && (
              <p id="timer-display" className={`font-semibold ${timeLeft <= 5 && timeLeft > 0 && !isAnswered ? 'text-red-500 anim-pulse' : 'text-gray-600'}`}>
                Tiempo: {timeLeft}s
              </p>
            )}
          </div>
          {!isTraining && <ProgressBar current={questionNumber} total={totalQuestions} />}
        </div>
      </div>

      <div className="px-4 sm:px-6 flex-grow flex flex-col justify-center">
        <div id="question-text-container" className={`my-6 text-center ${questionContainerClass}`}>
          <p className="text-xl md:text-2xl font-serif italic p-6 bg-white/60 rounded-xl shadow-md text-gray-700">
            "{currentQuestion.verse}"
          </p>
        </div>

        <div id="options-container" className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={option.text + index} 
              onClick={() => processAnswer(index, false)}
              disabled={isAnswered}
              variant={getButtonVariant(index)}
              className={`w-full text-sm md:text-base anim-fade-in-up 
                          ${isAnswered && getButtonVariant(index) !== 'option' ? '' : isAnswered ? 'opacity-60' : ''}
                        `}
              style={{ animationDelay: `${index * 100}ms` }}
              aria-pressed={selectedAnswerInfo?.selectedIndex === index && !selectedAnswerInfo.isTimeout}
            >
              {option.text}
              {selectedAnswerInfo && index === selectedAnswerInfo.selectedIndex && !selectedAnswerInfo.isTimeout && (
                <span className="font-bold ml-2">{selectedAnswerInfo.isCorrectResponse ? '✓' : '✗'}</span>
              )}
            </Button>
          ))}
        </div>
         {selectedAnswerInfo?.isTimeout && (
            <p className="text-center text-red-600 font-semibold mt-4 anim-fade-in">¡Se acabó el tiempo! (-1 Pto)</p>
        )}
      </div>
    </div>
  );
};

export default GameScreen;