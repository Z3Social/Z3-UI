import { useEffect, useMemo, useState } from 'react';
const defaultState = {
  width: 0,
  height: 0
};
const useDimensions = () => {
  const [element, setRef] = useState(null);
  const [rect, setRect] = useState(defaultState);
  const observer = useMemo(() => new window.ResizeObserver(entries => {
    if (entries[0]) {
      const {
        width,
        height
      } = entries[0].contentRect;
      setRect({
        width,
        height
      });
    }
  }), []);
  useEffect(() => {
    if (!element) return null;
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);
  return [element, setRef, rect];
};
export { useDimensions };