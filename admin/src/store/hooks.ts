import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import type { AppDispatch, RootState } from '@/store/store';

/**
 * Typed Redux hooks — always import these instead of the raw `react-redux`
 * hooks so components get full type inference without repeating generics.
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
