import React, { useState } from 'react';
import { MemoryCardData } from '../types';
import Button from './Button'; // For the modal's close button

interface MemoryCardProps {
  card: MemoryCardData;
  onAttemptFlip: () => void; // Renamed from onClick
  isGameInteractionDisabled: boolean; // Renamed from isDisabled
}

const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);


const MemoryCard: React.FC<MemoryCardProps> = ({ card, onAttemptFlip, isGameInteractionDisabled }) => {
  const { isFlipped, isMatched, content } = card;
  const [showFullContentModal, setShowFullContentModal] = useState(false);

  const cardBaseStyle = "w-full aspect-[3/4] rounded-lg shadow-lg flex items-center justify-center p-2 text-center cursor-pointer transition-all duration-300 ease-in-out select-none";
  
  let cardFrontBg = "bg-white";
  let cardBackBg = "bg-amber-500";
  let textColor = "text-gray-700";
  let borderColor = "border-transparent";

  if (isMatched) {
    cardFrontBg = "bg-green-100";
    borderColor = "border-green-500";
    textColor = "text-green-700 opacity-70"; 
  } else if (isFlipped) {
    cardFrontBg = "bg-amber-100";
    borderColor = "border-amber-500";
  }

  const handleCardPress = () => {
    if (isFlipped) {
      setShowFullContentModal(true);
    } else if (!isGameInteractionDisabled) {
      onAttemptFlip();
    }
  };

  const handleModalClose = () => {
    setShowFullContentModal(false);
  };

  return (
    <>
      <button
        onClick={handleCardPress}
        disabled={!card.isFlipped && isGameInteractionDisabled}
        className={`relative ${cardBaseStyle} ${isMatched ? 'cursor-default' : ''} perspective group`}
        aria-label={isFlipped ? `Carta: ${content.substring(0,20)}...` : "Carta boca abajo"}
        aria-pressed={isFlipped && !isMatched}
      >
        <div 
          className={`absolute inset-0 w-full h-full preserve-3d transition-transform duration-500 ${isFlipped ? 'rotateY-180' : 'rotateY-0'}`}
        >
          {/* Card Back */}
          <div className={`absolute inset-0 w-full h-full ${cardBackBg} rounded-lg backface-hidden flex items-center justify-center border-2 border-amber-600`}>
            <span className="font-serif text-3xl text-white">?</span>
          </div>
          {/* Card Front */}
          <div className={`absolute inset-0 w-full h-full ${cardFrontBg} ${textColor} rounded-lg backface-hidden rotateY-180 border-2 ${borderColor} flex flex-col items-center justify-center p-1 sm:p-2`}>
            <p className="font-serif text-xs sm:text-sm md:text-[0.7rem] lg:text-xs overflow-hidden leading-tight flex-grow text-center flex items-center justify-center">
              {content}
            </p>
            {isFlipped && (
              <div className="absolute bottom-1 right-1 opacity-50">
                <MagnifyingGlassIcon className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </button>

      {showFullContentModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 anim-fade-in"
          onClick={handleModalClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="full-content-title"
        >
          <div 
            className="bg-white rounded-xl shadow-2xl p-5 sm:p-6 w-full max-w-md text-gray-800 relative transform transition-all"
            onClick={e => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <h3 id="full-content-title" className="text-xl sm:text-2xl font-serif font-semibold mb-3 sm:mb-4 text-center text-amber-600">
              Contenido Completo
            </h3>
            <div className="border-t border-b border-gray-200 my-3 sm:my-4 py-3 sm:py-4 max-h-[60vh] overflow-y-auto">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap px-1">
                {content}
              </p>
            </div>
            <Button 
              onClick={handleModalClose} 
              variant="primary" 
              className="w-full mt-2 py-2.5"
              aria-label="Cerrar ventana de contenido completo"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MemoryCard;