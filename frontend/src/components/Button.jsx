"use client";

export default function Button({ buttonText, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white
        transition-colors duration-200 ease-in-out outline-none
        focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        hover:bg-teal-800 ${className}`}
    >
      {buttonText}
    </button>
  );
}
