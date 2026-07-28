import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1000
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = prevValueRef.current;
    const endValue = Number(value) || 0;
    const change = endValue - startValue;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad function
      const easeProgress = progress * (2 - progress);
      const currentValue = startValue + change * easeProgress;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <span>
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
