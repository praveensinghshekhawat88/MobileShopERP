/**
 * Default pagination values shared by every module's list screen.
 * Never hardcode these values inline — see 07_CODING_STANDARDS.md § Magic Values.
 */
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_INDEX = 0;
