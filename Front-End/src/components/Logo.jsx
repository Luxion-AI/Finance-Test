import React from 'react';

const Logo = ({ className = 'h-8 w-8', showText = false, textClass = 'text-xl font-bold' }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Use FTacker.png image */}
      <img src="/FTacker.png" alt="FinTrack Logo" className={`${className} object-contain`} />

      {showText && (
        <span className={`${textClass} tracking-tight font-black text-text`}>
          Fin<span className="text-primary">Track</span>
        </span>
      )}
    </div>
  );
};

export default Logo;