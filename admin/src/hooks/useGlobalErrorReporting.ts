import { useEffect } from 'react';

import { env } from '@/config/env';
import { registerGlobalErrorHandlers } from '@/utils/registerGlobalErrorHandlers';

/** Wires global error listeners once at app startup — see P11-T006. */
export function useGlobalErrorReporting(): void {
  useEffect(() => {
    document.title = env.appName;
    return registerGlobalErrorHandlers();
  }, []);
}
