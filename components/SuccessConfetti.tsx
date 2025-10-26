'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface SuccessConfettiProps {
  show: boolean;
  duration?: number;
}

export default function SuccessConfetti({ show, duration = 3000 }: SuccessConfettiProps) {
  const [isActive, setIsActive] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set window size on mount
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Update on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (show) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isActive) return null;

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
      colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']}
    />
  );
}
