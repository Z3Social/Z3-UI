import { decode } from 'blurhash';
import React, { useRef, useEffect } from 'react';
/**
 * Renders a blurhash in a canvas element.
 * @see {@link https://blurha.sh/}
 */
const Blurhash = ({
  hash,
  width = 32,
  height = width,
  dummy = false,
  ...canvasProps
}) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const {
      current: canvas
    } = canvasRef;
    if (!canvas) return;

    // resets canvas
    canvas.width = canvas.width; // eslint-disable-line no-self-assign

    if (dummy || !hash) return;
    try {
      const pixels = decode(hash, width, height);
      const ctx = canvas.getContext('2d');
      const imageData = new ImageData(pixels, width, height);
      if (!ctx) return;
      ctx.putImageData(imageData, 0, 0);
    } catch (err) {
      console.error('Blurhash decoding failure', {
        err,
        hash
      });
    }
  }, [dummy, hash, width, height]);
  return <canvas {...canvasProps} ref={canvasRef} width={width} height={height} />;
};
export default React.memo(Blurhash);