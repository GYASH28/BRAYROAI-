// Adapt only the drawing buffer. Geometry, trajectories and CSS layout stay intact.
// Recovery needs sustained 60Hz headroom; a 25ms frame is pressure, not recovery.
export function createRasterBudget() {
  let scale = 1;
  let settling = 1;
  let pressure = 0;
  let recovery = 0;
  const reset = () => { settling = 1; pressure = 0; recovery = 0; };
  return {
    reset,
    sample(seconds) {
      if (!Number.isFinite(seconds) || seconds <= 0) return null;
      // A single stall cannot spend a whole adaptation window.
      const duration = Math.min(seconds, 0.1);
      if (settling > 0) { settling -= duration; return null; }
      if (seconds > 0.020) {
        pressure += duration;
        recovery = 0;
      } else {
        pressure = Math.max(0, pressure - duration * 2);
        // The dead band avoids promoting a renderer already near its limit.
        recovery = seconds <= 0.018 ? recovery + duration : 0;
      }
      if (pressure >= 0.6 && scale > 0.7) {
        scale = Math.max(0.7, Math.round((scale - 0.15) * 100) / 100);
        reset();
        return scale;
      }
      if (recovery >= 5 && scale < 1) {
        scale = Math.min(1, Math.round((scale + 0.15) * 100) / 100);
        reset();
        return scale;
      }
      return null;
    },
  };
}
