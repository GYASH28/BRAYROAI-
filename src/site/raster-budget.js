// Runtime quality budgets protect smooth motion first, then recover detail only
// after sustained headroom. Layout, choreography and semantic content never change.
export function createRasterBudget() {
  let scale = 1;
  let settling = 0.55;
  let pressure = 0;
  let recovery = 0;
  const reset = () => { settling = 0.55; pressure = 0; recovery = 0; };
  return {
    reset,
    sample(seconds) {
      if (!Number.isFinite(seconds) || seconds <= 0) return null;
      const duration = Math.min(seconds, 0.1);
      if (settling > 0) { settling -= duration; return null; }
      if (seconds > 0.020) {
        pressure += duration;
        recovery = 0;
      } else {
        pressure = Math.max(0, pressure - duration * 2.4);
        recovery = seconds <= 0.018 ? recovery + duration : 0;
      }
      if (pressure >= 0.32 && scale > 0.55) {
        scale = Math.max(0.55, Math.round((scale - 0.15) * 100) / 100);
        reset();
        return scale;
      }
      if (recovery >= 6 && scale < 1) {
        scale = Math.min(1, Math.round((scale + 0.15) * 100) / 100);
        reset();
        return scale;
      }
      return null;
    },
  };
}

export function createPointBudget(total = 9600) {
  const safeTotal = Math.max(1, Math.round(total));
  const quantum = safeTotal >= 240 ? 24 : 1;
  const ratios = [1, 0.75, 0.5625, 0.4375, 0.3375];
  const tiers = [...new Set(ratios.map(ratio => {
    if (ratio === 1) return safeTotal;
    return Math.max(quantum, Math.min(safeTotal,
      Math.round((safeTotal * ratio) / quantum) * quantum));
  }))].sort((a, b) => b - a);
  let tier = 0;
  let settling = 0.8;
  let pressure = 0;
  let recovery = 0;
  const reset = () => { settling = 0.65; pressure = 0; recovery = 0; };
  return {
    reset,
    sample(seconds) {
      if (!Number.isFinite(seconds) || seconds <= 0) return null;
      const duration = Math.min(seconds, 0.1);
      if (settling > 0) { settling -= duration; return null; }
      if (seconds > 0.019) {
        pressure += duration;
        recovery = 0;
      } else {
        pressure = Math.max(0, pressure - duration * 2.6);
        recovery = seconds <= 0.0178 ? recovery + duration : 0;
      }
      if (pressure >= 0.4 && tier < tiers.length - 1) {
        tier += 1;
        const next = tiers[tier];
        reset();
        return next;
      }
      if (recovery >= 8 && tier > 0) {
        tier -= 1;
        const next = tiers[tier];
        reset();
        return next;
      }
      return null;
    },
  };
}
