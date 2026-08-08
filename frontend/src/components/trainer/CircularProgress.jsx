import React from 'react';

// Small circular progress ring used in the Course Progress tab.
const CircularProgress = ({ pct, size = 44, stroke = 4, color = '#4f46e5' }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={pct === 100 ? '#10b981' : pct >= 50 ? color : '#f59e0b'}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
      />
      <text
        x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700"
        fill={pct === 100 ? '#10b981' : pct >= 50 ? color : '#f59e0b'}
        style={{ transform: `rotate(90deg) translate(0, -${size}px)` }}
      >
        {pct}%
      </text>
    </svg>
  );
};

export default CircularProgress;
