import React from 'react';

interface CircularProgressProps {
  percentage: number;     // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
  fontSize?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 56,
  strokeWidth = 6,
  color = '#3b82f6',    // Tailwind's 'blue-500'
  trackColor = '#e2e8f0',  // Tailwind's 'slate-100'
  textColor = '#374151',   // Tailwind's 'gray-700'
  fontSize = 12,
}) => {
  // Clamp percentage to [0..100] and limit to 3 digits max
  const normalized = Math.min(100, Math.max(0, Math.round(percentage)));
  const displayText = normalized === 100 ? '100' : normalized.toString().slice(0, 2);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <svg width={size} height={size} className="circular-progress">
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

      {/* Text in the center of the circle */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fill={textColor}
      >
        {displayText}%
      </text>
    </svg>
  );
};

export default CircularProgress; 