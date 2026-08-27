const HOURS_SCALE = 100;

export function sumHours(hours: number[]): number {
  const scaledTotal = hours.reduce((sum, value) => sum + Math.round(value * HOURS_SCALE), 0);
  return scaledTotal / HOURS_SCALE;
}
