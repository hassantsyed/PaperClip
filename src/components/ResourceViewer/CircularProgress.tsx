import React, { useState } from 'react';

interface CircularProgressProps {
  percentage: number;     // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
  fontSize?: number;
  onMarkAsRead?: () => void;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 56,
  strokeWidth = 6,
  color = '#3b82f6',    // Tailwind's 'blue-500'
  trackColor = '#e2e8f0',  // Tailwind's 'slate-100'
  textColor = '#374151',   // Tailwind's 'gray-700'
  fontSize = 12,
  onMarkAsRead,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Clamp percentage to [0..100] and limit to 3 digits max
  const normalized = Math.min(100, Math.max(0, Math.round(percentage)));
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <svg 
      width={size} 
      height={size} 
      className="circular-progress cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onMarkAsRead}
    >
      {isHovered ? (
        <>
          {/* Solid green circle background */}
          <circle
            fill="#22c55e"
            r={size / 2}
            cx={size / 2}
            cy={size / 2}
          />
          {/* White checkmark */}
          <path
            d="M16 32 L24 40 L40 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`scale(${size/56})`} // Scale checkmark based on size prop
          />
        </>
      ) : (
        <>
          {/* Track circle (gray background) */}
          <circle
            stroke={trackColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Progress circle (blue arc) */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Percentage text */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            fill={textColor}
          >
            {normalized === 100 ? '100' : normalized.toString().slice(0, 2)}%
          </text>
        </>
      )}
    </svg>
  );
};

export default CircularProgress; 