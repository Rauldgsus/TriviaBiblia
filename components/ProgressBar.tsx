import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0; // Ensure current isn't > total visually

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 shadow-inner">
      <div
        className="bg-amber-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      ></div>
    </div>
  );
};

export default ProgressBar;