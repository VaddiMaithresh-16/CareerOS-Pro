import { useRef, useCallback } from 'react';

/**
 * useDragVelocity — tracks pointer position + velocity history during a drag.
 * Per apple-design §2 (1:1 tracking) and §5 (velocity handoff at release).
 *
 * Returns handlers you spread onto the drag target. On release, calls
 * `onRelease(offset, velocity)` where velocity is in px/s.
 *
 * Designed for pointer events (mouse + touch unified) with setPointerCapture.
 */
export function useDragVelocity({ onRelease, onMove, axis = 'y' }) {
  const startRef = useRef(null);       // { x, y, t }
  const lastRef = useRef(null);        // last pointer sample for velocity
  const historyRef = useRef([]);       // short position/timestamp history

  const onPointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    lastRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    historyRef.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!startRef.current) return;
    const now = performance.now();
    const sample = { x: e.clientX, y: e.clientY, t: now };
    historyRef.current.push(sample);
    // Keep only last ~100ms of history for a stable velocity reading
    while (historyRef.current.length > 2 && now - historyRef.current[0].t > 100) {
      historyRef.current.shift();
    }
    lastRef.current = sample;
    const s = startRef.current;
    const offset = axis === 'y' ? sample.y - s.y : sample.x - s.x;
    onMove?.(offset);
  }, [onMove, axis]);

  const onPointerUp = useCallback((e) => {
    if (!startRef.current) return;
    const s = startRef.current;
    const h = historyRef.current;
    // Compute velocity from recent history (px/s)
    let velocity = 0;
    if (h.length >= 2) {
      const first = h[0];
      const last = h[h.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt > 0) {
        const delta = axis === 'y' ? last.y - first.y : last.x - first.x;
        velocity = delta / dt;
      }
    }
    const release = axis === 'y' ? e.clientY - s.y : e.clientX - s.x;
    onRelease?.(release, velocity);
    startRef.current = null;
    lastRef.current = null;
    historyRef.current = [];
  }, [onRelease, axis]);

  return { onPointerDown, onPointerMove, onPointerUp };
}