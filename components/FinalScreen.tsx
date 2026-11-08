
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { GameEndPayload, GameMode, PlayerInfo } from '../types';
import confetti from 'canvas-confetti';

interface FinalScreenProps {
  results: GameEndPayload;
  onPlayAgain: () => void; 
  onChangeSettings: () => void;
  showRegistration?: boolean;
  onRegister?: (player: PlayerInfo) => void;
}

const FinalScreen: React.FC<FinalScreenProps> = ({ 
  results, 
  onPlayAgain, 
  onChangeSettings,
  showRegistration = false,
  onRegister
}) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showRegistration) {
      // Small delay to let the screen transition finish
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#d97706']
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showRegistration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !onRegister) return;
    setIsSubmitting(true);
    try {
      await onRegister({ nombre, email });
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  let titleMessage = "¡Sigue adelante!";
  let scoreDisplay: React.ReactNode;

  if (results.type === 'trivia') {
    const percentageCorrect = results.totalQuestions > 0 ? Math.round((results.correctAnswersCount / results.totalQuestions) * 100) : 0;
    if (percentageCorrect >= 80) titleMessage = "¡Excelente trabajo en la Trivia! Tu conocimiento es una luz.";
    else if (percentageCorrect >= 50) titleMessage = "¡Buen esfuerzo en la Trivia! Sigue explorando la Palabra.";
    else titleMessage = "¡Ánimo en la Trivia! Cada día es una oportunidad para aprender.";
    
    scoreDisplay = (
      <>
        <div>
          <p className="text-xl text-gray-600">Puntuación Neta Final (Trivia):</p>
          <p className="text-5xl md:text-6xl font-bold text-amber-600">{results.netScore}</p>
        </div>
        <div>
            <p className="text-lg text-gray-500">Respuestas Correctas:</p>
            <p className="text-3xl font-semibold text-green-600">{results.correctAnswersCount} / {results.totalQuestions}</p>
            <p className="text-xl text-gray-500 mt-1">({percentageCorrect}% de aciertos)</p>
        </div>
      </>
    );
  } else if (results.type === 'memory') {
    if (results.moves <= results.totalPairs * 2.5) titleMessage = "¡Memoria prodigiosa! ¡Excelente!";
    else if (results.moves <= results.totalPairs * 3.5) titleMessage = "¡Muy bien jugado el juego de memoria!";
    else titleMessage = "¡Buen intento en el juego de memoria! ¡Sigue practicando!";

    scoreDisplay = (
      <>
        <div>
          <p className="text-xl text-gray-600">Juego de Memoria Completado:</p>
           <p className="text-3xl font-semibold text-green-600">{results.totalPairs} Pares Encontrados</p>
        </div>
        <div>
          <p className="text-lg text-gray-500">Movimientos Realizados:</p>
          <p className="text-5xl md:text-6xl font-bold text-amber-600">{results.moves}</p>
        </div>
      </>
    );
  } else if (results.type === 'order_verse') {
    const percentageCorrect = results.versesAttempted > 0 ? Math.round((results.versesCorrect / results.versesAttempted) * 100) : 0;
    if (percentageCorrect >= 80) titleMessage = "¡Maestro del Orden! Versículos armados a la perfección.";
    else if (percentageCorrect >= 50) titleMessage = "¡Bien hecho ordenando los versículos!";
    else titleMessage = "¡Sigue practicando el orden de los versículos!";

    scoreDisplay = (
        <>
            <div>
                <p className="text-xl text-gray-600">Juego "Ordenar Versículo" Completado:</p>
                <p className="text-5xl md:text-6xl font-bold text-amber-600">{results.score} Puntos</p>
            </div>
            <div>
                <p className="text-lg text-gray-500">Versículos Correctos:</p>
                <p className="text-3xl font-semibold text-green-600">{results.versesCorrect} / {results.versesAttempted}</p>
                <p className="text-xl text-gray-500 mt-1">({percentageCorrect}% de aciertos)</p>
            </div>
        </>
    );
  } else if (results.type === 'recite_verse') {
    const percentageCorrect = results.versesAttempted > 0 ? Math.round((results.versesCorrect / results.versesAttempted) * 100) : 0;
    if (percentageCorrect === 100) titleMessage = "¡Recitación Impecable! Eres un experto en la Palabra.";
    else if (percentageCorrect >= 70) titleMessage = "¡Muy buena recitación! Sigue memorizando.";
    else if (percentageCorrect >= 40) titleMessage = "¡Buen esfuerzo recitando!";
    else titleMessage = "¡Sigue practicando la recitación!";

    scoreDisplay = (
      <>
        <div>
          <p className="text-xl text-gray-600">Juego "Recitar Versículo" Completado:</p>
          <p className="text-5xl md:text-6xl font-bold text-amber-600">{results.score} Puntos</p>
        </div>
        <div>
          <p className="text-lg text-gray-500">Versículos Correctos:</p>
          <p className="text-3xl font-semibold text-green-600">{results.versesCorrect} / {results.versesAttempted}</p>
          <p className="text-xl text-gray-500 mt-1">({percentageCorrect}% de aciertos)</p>
        </div>
      </>
    );
  } else if (results.type === 'book_sort') {
    if (results.score === results.totalBooks && results.mistakes === 0) titleMessage = "¡Bibliotecario Divino! Orden perfecto.";
    else if (results.score === results.totalBooks) titleMessage = "¡Libros ordenados correctamente! Buen trabajo.";
    else titleMessage = "¡Sigue aprendiendo el orden de los libros!";
    
    scoreDisplay = (
      <>
        <div>
            <p className="text-xl text-gray-600">Libros Ordenados:</p>
            <p className="text-5xl md:text-6xl font-bold text-green-600">{results.score} / {results.totalBooks}</p>
        </div>
        <div>
            <p className="text-lg text-gray-500">Errores cometidos:</p>
            <p className="text-3xl font-semibold text-red-500">{results.mistakes}</p>
        </div>
      </>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 min-h-[400px] bg-white/30 backdrop-blur-md rounded-xl shadow-xl">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-700 mb-4 anim-fade-in-up">{titleMessage}</h2>
      <div className="my-6 space-y-4 anim-fade-in-up animation-delay-100">{scoreDisplay}</div>

      {showRegistration && (
        <div className="w-full max-w-md bg-amber-50 p-6 rounded-xl border-2 border-amber-300 shadow-xl mb-6 anim-fade-in-up animation-delay-200 ring-4 ring-amber-400/20 animate-pulse-subtle">
          <h3 className="font-serif text-xl font-bold text-amber-800 mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl">🏆</span> ¡Nuevo Récord Personal! <span className="text-2xl">🏆</span>
          </h3>
          <p className="text-sm text-amber-700 mb-4">Registra tu puntaje para aparecer en el Ranking Top 20.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input 
                type="text" 
                placeholder="Tu Nombre" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-amber-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Tu Correo Electrónico" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-amber-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar en el Ranking'}
            </Button>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md mt-4">
        <Button onClick={onPlayAgain} variant="primary" className="w-full text-lg anim-fade-in-up animation-delay-200">Jugar de Nuevo</Button>
        <Button onClick={onChangeSettings} variant="secondary" className="w-full text-lg anim-fade-in-up animation-delay-300">Cambiar Configuración</Button>
      </div>
    </div>
  );
};

export default FinalScreen;
