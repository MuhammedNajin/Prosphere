import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-5 bg-orange-400 rounded-full transform -translate-y-10"
            style={{
              animationDelay: `${index * 0.1}s`,
              transform: `rotate(${index * 30}deg) translateY(26px)`,
              opacity: 1 - (index * 0.08),
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes spinner {
          0% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .bg-orange-400 {
          animation: spinner 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Spinner;