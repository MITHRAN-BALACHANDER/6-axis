import React from "react";

export default function Header() {
  return (
    <header className="w-full py-5 px-3 flex justify-center items-center border-b-2 border-gray-200 bg-white">
      <div className="flex items-center w-full max-w-7xl justify-between">
        {/* NBA Logo */}
        <div className="flex-shrink-0 text-center">
          <img
            src="/image.png"
            alt="NBA Accreditation"
            className="h-20 mx-auto mb-2 block"
          />
        </div>
        {/* College Info */}
        <div className="flex-1 px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 my-2">
            SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY
          </h1>
          <p className="text-base md:text-lg font-semibold text-gray-700 my-1">
            Six Axis Robot
          </p>
        </div>
        {/* NAAC Logo */}
        <div className="flex-shrink-0 text-center">
          <img
            src="/naac-logo.png"
            alt="NAAC Accreditation"
            className="h-20 mx-auto mb-2 block"
          />
        </div>
      </div>
    </header>
  );
}
