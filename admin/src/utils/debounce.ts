/**
 * Generic debounce helper — used by search inputs across every module
 * (see 09_PERFORMANCE.md § Searching: Debounce 300ms, Server Side).
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}
