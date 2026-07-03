import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  key?: React.Key;
  value: number;
  duration?: number; // duration in ms
  formatter?: (val: number) => string;
}

export function AnimatedCounter({ value, duration = 1500, formatter }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Falls back gracefully if running in environment where IntersectionObserver isn't defined
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let startTimestamp: number | null = null;
        
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          
          // quart-out ease curve (exceedingly smooth and deceleration-heavy)
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentVal = Math.floor(easeOutQuart * value);
          
          setCount(currentVal);
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(value);
          }
        };
        
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  // Default localized string formatting
  const displayValue = formatter ? formatter(count) : count.toLocaleString();

  return <span ref={elementRef} className="font-mono">{displayValue}</span>;
}

// Lightweight wrapper to parse string values (e.g. "99.4%" or "392,738 results") and animate just the numbers
interface NumericTransitionProps {
  key?: React.Key;
  text: string;
  duration?: number;
}

export function NumericTransition({ text, duration = 1200 }: NumericTransitionProps) {
  // Regex to detect number tokens like "392,738" or "99.4" or "99.99"
  const numberRegex = /([0-9,.]+)/g;
  const parts = text.split(numberRegex);
  
  return (
    <>
      {parts.map((part, index) => {
        // Test if this part is a number match
        const isNum = /^[0-9,.]+$/.test(part);
        if (isNum) {
          const numericValue = parseFloat(part.replace(/,/g, ''));
          if (!isNaN(numericValue)) {
            // Determine decimal places for percentages etc.
            const hasDecimals = part.includes('.');
            const decimalPlaces = hasDecimals ? part.split('.')[1].length : 0;
            
            return (
              <AnimatedCounter
                key={index}
                value={numericValue}
                duration={duration}
                formatter={(val) => {
                  if (hasDecimals) {
                    // Smoothly animate decimal values
                    let startTimestamp = performance.now();
                    return val.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                  return Math.round(val).toLocaleString();
                }}
              />
            );
          }
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}
