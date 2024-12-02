import React from 'react';

interface SpinnerProps {
  color?: string;
  size?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  color = '#3498db', // Default blue color
  size = 80,
  className = ''
}) => {
  const scale = size / 80;

  const spinnerStyle: React.CSSProperties = {
    color: color, // Color can be any valid CSS color value
    display: 'inline-block',
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
  };

  const getBarStyle = (index: number): React.CSSProperties => ({
    transformOrigin: `${40 * scale}px ${40 * scale}px`,
    animation: 'spinner 1.2s linear infinite',
    animationDelay: `${-1.1 + index * 0.1}s`,
    transform: `rotate(${index * 30}deg)`,
    position: 'absolute',
    width: '100%',
    height: '100%',
  });

  const generateDynamicStyles = () => `
    .spinner > div:after {
      content: " ";
      display: block;
      position: absolute;
      top: ${3.2 * scale}px;
      left: ${36.8 * scale}px;
      width: ${6.4 * scale}px;
      height: ${17.6 * scale}px;
      border-radius: 20%;
      background: currentColor;
    }

    @keyframes spinner {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `;

  React.useEffect(() => {
    const styleId = `spinner-style-${size}`;
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.innerText = generateDynamicStyles();
      document.head.appendChild(styleSheet);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [size]);

  return (
    <div className={`spinner ${className}`} style={spinnerStyle}>
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} style={getBarStyle(index)} />
      ))}
    </div>
  );
};
