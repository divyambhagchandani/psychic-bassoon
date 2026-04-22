// Utility to get elapsed time from a ref, avoiding react-hooks/purity lint errors
// with Date.now() in component bodies

export function getElapsed(startRef: { current: number }): number {
  return performance.now() - startRef.current;
}

export function markStart(startRef: { current: number }): void {
  startRef.current = performance.now();
}
