'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: 'primary' | 'green' | 'teal' | 'orange';
  showPercentage?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  label,
  color = 'primary',
  showPercentage = true,
  animated = true,
}: ProgressBarProps) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, animated]);

  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    teal: 'bg-teal-500',
    orange: 'bg-orange-500',
  };

  const bgColorClasses = {
    primary: 'bg-primary-100',
    green: 'bg-green-100',
    teal: 'bg-teal-100',
    orange: 'bg-orange-100',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-neutral-900">{progress}%</span>
          )}
        </div>
      )}
      <div className={`w-full h-3 ${bgColorClasses[color]} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${currentProgress}%` }}
        />
      </div>
    </div>
  );
}
