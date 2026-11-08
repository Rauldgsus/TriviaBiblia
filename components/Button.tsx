import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'option' | 'correct' | 'incorrect' | 'default';
  children: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyle = "font-bold py-3 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed";
  
  let variantStyle = '';
  switch (variant) {
    case 'primary': // Amber button for Start/Restart
      variantStyle = 'bg-amber-500 text-white shadow-lg hover:bg-amber-600 hover:shadow-xl active:scale-95 hover:-translate-y-px';
      break;
    case 'secondary': // Transparent amber border for Change Category
      variantStyle = 'bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white active:scale-95 hover:-translate-y-px';
      break;
    case 'option': // Quiz option buttons
      variantStyle = 'p-4 rounded-lg bg-white/80 shadow-md hover:bg-amber-100/70 hover:scale-105 text-gray-700 text-left justify-start font-medium';
      break;
    case 'correct': // Correct answer
      variantStyle = 'p-4 rounded-lg bg-green-500 text-white anim-pulse text-left justify-start font-medium scale-100'; // pulse applied via class if needed
      break;
    case 'incorrect': // Incorrect answer
      variantStyle = 'p-4 rounded-lg bg-red-500 text-white text-left justify-start font-medium';
      break;
    default: // Fallback, similar to primary but can be less prominent
      variantStyle = 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-400 active:scale-95';
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;