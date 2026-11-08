import React from 'react';

interface DropdownProps<T extends string | number> {
  options: Array<{ value: T; label: string }>;
  selectedValue: T;
  onChange: (value: T) => void;
  id?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean; // Nueva prop
}

const Dropdown = <T extends string | number>({ options, selectedValue, onChange, id, className, ariaLabel, disabled = false }: DropdownProps<T>) => {
  return (
    <div className={`relative inline-block w-full ${className}`}>
      <select
        id={id}
        value={selectedValue}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={ariaLabel || "Select an option"}
        className="w-full appearance-none bg-white/70 backdrop-blur-sm text-gray-700 font-medium py-3 px-4 pr-8 rounded-lg border-2 border-amber-500/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:opacity-70 disabled:bg-gray-100/70 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value.toString()} value={option.value} className="text-gray-800 bg-white">
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default Dropdown;