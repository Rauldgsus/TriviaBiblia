
import React, { useState, useEffect, useCallback } from 'react';
import { TimelineItemData, TimelineDifficultySetting, GameEndPayload, TimelineGameEndPayload } from '../types';
import Button from './Button';
import ProgressBar from './ProgressBar';

interface TimelineGameScreenProps {
  items: TimelineItemData[];
  difficulty: TimelineDifficultySetting;
  onGameEnd: (results: GameEndPayload) => void;
  isTraining?: boolean;
}

interface PlacedItem {
  slotIndex: number; // 0-based index of the slot
  item: TimelineItemData | null;
  status: 'empty' | 'placed' | 'correct' | 'incorrect';
}

const TimelineGameScreen: React.FC<TimelineGameScreenProps> = ({ items, difficulty, onGameEnd, isTraining = false }) => {
  // Correctly sorted items for internal validation (subset of full list)
  const [sortedCorrectItems, setSortedCorrectItems] = useState<TimelineItemData[]>([]);
  // Shuffled items available to be placed
  const [availableItems, setAvailableItems] = useState<TimelineItemData[]>([]);
  // The timeline slots
  const [slots, setSlots] = useState<PlacedItem[]>([]);
  
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  
  // Interaction state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null); // For click-to-place
  const [isVerified, setIsVerified] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(difficulty.timerDuration || 0);
  const [timerId, setTimerId] = useState<number | null>(null);

  useEffect(() => {
    // 1. Sort input items chronologically to establish the "Truth"
    const sorted = [...items].sort((a, b) => a.orderId - b.orderId);
    setSortedCorrectItems(sorted);

    // 2. Shuffle them for the "Bank"
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAvailableItems(shuffled);

    // 3. Create Empty Slots
    const initialSlots: PlacedItem[] = Array(items.length).fill(null).map((_, i) => ({
      slotIndex: i,
      item: null,
      status: 'empty'
    }));
    setSlots(initialSlots);

    // Reset stats
    setScore(0);
    setMistakes(0);
    setIsVerified(false);
    setSelectedItemId(null);

    // Timer Logic
    if (timerId) clearInterval(timerId);
    if (!isTraining && difficulty.timerDuration && difficulty.timerDuration > 0) {
        setTimeLeft(difficulty.timerDuration);
        const tid = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(tid as unknown as number);
                    finishGame(score, mistakes + 1); // Timeout counts as mistake/end
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        setTimerId(tid as unknown as number);
    }

    return () => {
        if (timerId) clearInterval(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, difficulty, isTraining]);


  const finishGame = (finalScore: number, finalMistakes: number) => {
    if (timerId) clearInterval(timerId);
    const results: TimelineGameEndPayload = {
      type: 'timeline',
      score: finalScore,
      totalItems: items.length,
      mistakes: finalMistakes
    };
    onGameEnd(results);
  };

  const handleFinishTraining = () => {
      finishGame(score, mistakes);
  };

  // --- Interaction Logic ---

  const handleItemSelect = (item: TimelineItemData) => {
    if (isVerified) return;
    if (selectedItemId === item.id) {
        setSelectedItemId(null); // Deselect
    } else {
        setSelectedItemId(item.id);
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isVerified) return;
    
    // If we have an item selected from the bank, place it here
    if (selectedItemId) {
        const itemToPlace = availableItems.find(i => i.id === selectedItemId);
        if (itemToPlace) {
            placeItemInSlot(itemToPlace, slotIndex);
            setSelectedItemId(null);
        }
        return;
    }

    // If slot has an item, return it to bank (deselect/remove)
    const slot = slots[slotIndex];
    if (slot.item) {
        removeItemFromSlot(slotIndex);
    }
  };

  const placeItemInSlot = (item: TimelineItemData, slotIndex: number) => {
    // 1. Remove item from Available
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));

    // 2. Check if slot already has an item, if so, swap (return old to bank)
    const currentSlotItem = slots[slotIndex].item;
    if (currentSlotItem) {
        setAvailableItems(prev => [...prev, currentSlotItem]);
    }

    // 3. Update Slot
    setSlots(prev => prev.map((s, i) => 
        i === slotIndex ? { ...s, item: item, status: 'placed' } : s
    ));
  };

  const removeItemFromSlot = (slotIndex: number) => {
    const slotItem = slots[slotIndex].item;
    if (!slotItem) return;

    // Return to bank
    setAvailableItems(prev => [...prev, slotItem]);
    // Clear slot
    setSlots(prev => prev.map((s, i) => 
        i === slotIndex ? { ...s, item: null, status: 'empty' } : s
    ));
  };

  // --- HTML5 Drag & Drop Wrappers ---
  
  const handleDragStart = (e: React.DragEvent, item: TimelineItemData) => {
    if (isVerified) return;
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isVerified) return;
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    if (isVerified) return;
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    
    // Find item (could be in bank OR another slot)
    let item = availableItems.find(i => i.id === itemId);
    
    // If not in bank, check slots (moving from one slot to another)
    if (!item) {
        const sourceSlot = slots.find(s => s.item?.id === itemId);
        if (sourceSlot && sourceSlot.item) {
            item = sourceSlot.item;
            // Clear source slot
             setSlots(prev => prev.map((s) => 
                s.slotIndex === sourceSlot.slotIndex ? { ...s, item: null, status: 'empty' } : s
            ));
        }
    }

    if (item) {
        placeItemInSlot(item, slotIndex);
    }
  };

  // --- Verification ---

  const checkOrder = () => {
    let currentScore = 0;
    let currentMistakes = mistakes;
    let allCorrect = true;

    const newSlots = slots.map((slot, index) => {
        if (!slot.item) return slot;

        // The correct item for this slot (index) should match the sortedCorrectItems[index]
        const correctItemForThisSlot = sortedCorrectItems[index];
        const isCorrect = slot.item.id === correctItemForThisSlot.id;

        if (isCorrect) {
            currentScore++;
            return { ...slot, status: 'correct' as const };
        } else {
            currentMistakes++;
            allCorrect = false;
            return { ...slot, status: 'incorrect' as const };
        }
    });

    setSlots(newSlots);
    setScore(currentScore);
    setMistakes(currentMistakes);

    if (allCorrect && availableItems.length === 0) {
        setIsVerified(true); // Game Over (Success)
        // Delay slightly to show visual success state
        setTimeout(() => {
            finishGame(currentScore, currentMistakes);
        }, 1500);
    } else {
        // Not done yet or mistakes made. 
        // Logic: Keep correct ones fixed? 
        // For simplicity: Just show status. 
        // If "Incorrect", allow user to move them again?
        // The prompt says: "Incorrect -> bounce". 
        // We will reset status of incorrect items to 'placed' after a delay so they can be moved again.
        
        setTimeout(() => {
            setSlots(prev => prev.map(s => {
                if (s.status === 'incorrect') {
                    // return item to available? Or just reset status?
                    // "Rebota" implies it stays there but looks wrong, or pops back. 
                    // Let's pop it back to the bank to force re-think.
                    if (s.item) setAvailableItems(p => [...p, s.item!]);
                    return { ...s, item: null, status: 'empty' }; 
                }
                return s;
            }));
        }, 800);
    }
  };

  const allSlotsFilled = slots.every(s => s.item !== null);

  return (
    <div className="flex flex-col min-h-[600px] relative pt-20 pb-4 bg-white/30 backdrop-blur-md rounded-xl shadow-xl w-full">
      {/* Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 py-2 bg-white/80 backdrop-blur-sm shadow-md z-20 rounded-b-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-700">
           <div className="flex items-center gap-2">
               <span className="font-bold text-amber-600">Línea del Tiempo</span>
               {isTraining && (
                    <button onClick={handleFinishTraining} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 font-bold">
                        Terminar
                    </button>
                )}
           </div>
           
           {!isTraining && difficulty.timerDuration && difficulty.timerDuration > 0 && (
             <span className={`font-mono font-bold ${timeLeft < 15 ? 'text-red-500 anim-pulse' : 'text-gray-600'}`}>
                ⏱ {timeLeft}s
             </span>
           )}
        </div>
        {!isTraining && <ProgressBar current={slots.filter(s => s.status === 'correct').length} total={items.length} />}
      </div>

      <div className="flex-grow flex flex-col p-2 sm:p-4 overflow-hidden">
        
        {/* Timeline Area (Slots) - Horizontal Scrollable */}
        <div className="w-full overflow-x-auto pb-4 mb-4">
             <div className="flex space-x-2 sm:space-x-4 min-w-max px-2">
                 {slots.map((slot, index) => (
                     <div 
                        key={`slot-${index}`}
                        onClick={() => handleSlotClick(index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`
                            relative w-32 h-40 sm:w-40 sm:h-52 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-2 transition-all duration-300
                            ${slot.status === 'correct' ? 'border-green-500 bg-green-50' : ''}
                            ${slot.status === 'incorrect' ? 'border-red-500 bg-red-50 anim-shake' : ''}
                            ${slot.status === 'placed' ? 'border-amber-400 bg-white' : 'border-gray-300 bg-gray-50/50'}
                            ${selectedItemId && !slot.item ? 'ring-2 ring-amber-300 ring-opacity-50' : ''}
                        `}
                     >
                        {/* Timeline Connector Line */}
                        <div className="absolute top-1/2 -left-4 w-4 h-1 bg-gray-300 -z-10 hidden sm:block"></div>
                        {index < slots.length - 1 && <div className="absolute top-1/2 -right-4 w-4 h-1 bg-gray-300 -z-10 hidden sm:block"></div>}
                        
                        <div className="absolute top-[-10px] bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full z-10">
                            #{index + 1}
                        </div>

                        {slot.item ? (
                            <div className="text-center w-full h-full flex flex-col justify-between pointer-events-none">
                                <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-4">{slot.item.event}</p>
                                <span className="text-[10px] text-amber-600 font-mono mt-1">{slot.item.reference}</span>
                            </div>
                        ) : (
                            <span className="text-gray-300 font-bold text-2xl">+</span>
                        )}
                     </div>
                 ))}
             </div>
        </div>

        {/* Bank Area */}
        <div className="flex-grow bg-white/40 rounded-lg p-3 sm:p-4 overflow-y-auto">
             <p className="text-center text-sm text-gray-600 mb-2 italic">
                {selectedItemId 
                    ? "Toca un hueco numerado arriba para colocar la tarjeta." 
                    : "Arrastra eventos a la línea de tiempo o toca para seleccionar."}
             </p>
             <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                 {availableItems.map((item) => (
                     <div
                        key={item.id}
                        draggable={!isVerified}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onClick={() => handleItemSelect(item)}
                        className={`
                            w-28 sm:w-32 h-24 sm:h-28 bg-white border shadow-sm rounded-lg p-2 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md active:scale-95 transition-transform
                            ${selectedItemId === item.id ? 'ring-2 ring-amber-500 scale-105 border-amber-500' : 'border-gray-200'}
                        `}
                     >
                         <p className="text-xs font-medium text-gray-800 line-clamp-3">{item.event}</p>
                     </div>
                 ))}
                 {availableItems.length === 0 && !isVerified && (
                     <p className="text-gray-500 italic mt-4">Todos los eventos colocados. ¡Verifica!</p>
                 )}
             </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 bg-white/60 backdrop-blur-md rounded-b-xl">
         <Button 
            onClick={checkOrder}
            variant="primary"
            className="w-full"
            disabled={!allSlotsFilled || isVerified}
         >
            {isVerified ? "¡Completado!" : "Verificar Orden"}
         </Button>
      </div>
    </div>
  );
};

export default TimelineGameScreen;
