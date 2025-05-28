// components/AnimatedNumber.tsx
'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

export default function AnimatedNumber({ value, duration = 1000 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = performance.now();
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;
      
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(
        startValueRef.current + (value - startValueRef.current) * progress
      );
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}