import { useEffect, useRef, useState } from 'react';
import * as Network from 'expo-network';
import { replayQueue } from '../sync/syncManager';

interface NetworkStatus {
  isOnline: boolean;
  isLoading: boolean;
}

/**
 * Hook that tracks network connectivity.
 * Automatically triggers queue replay when transitioning offline → online.
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const prevIsOnline = useRef<boolean | null>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    async function checkNetwork() {
      try {
        const state = await Network.getNetworkStateAsync();
        const online = state.isConnected === true && state.isInternetReachable !== false;

        setIsOnline(online);
        setIsLoading(false);

        // Detect offline → online transition and trigger sync
        if (prevIsOnline.current === false && online) {
          console.log('[Network] Back online — starting queue replay');
          replayQueue().catch(console.error);
        }

        prevIsOnline.current = online;
      } catch {
        setIsOnline(false);
        setIsLoading(false);
      }
    }

    // Check immediately
    checkNetwork();

    // Poll every 5 seconds
    intervalId = setInterval(checkNetwork, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return { isOnline, isLoading };
}
