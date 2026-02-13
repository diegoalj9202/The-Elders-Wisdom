'use client';

interface ProgressIndicatorProps {
  percentage: number;
  label?: string;
}

export default function ProgressIndicator({ percentage, label }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-parchment font-semibold">{label}</span>
          <span className="text-gold font-bold">{percentage}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
