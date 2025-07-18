"use client";

export default function Button({ buttonText, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 text-base font-medium rounded-md
        bg-green-600 hover:bg-green-700 text-white
        transition-colors duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        w-full sm:w-auto ${className}`}
    >
      {buttonText}
    </button>
  );
}
