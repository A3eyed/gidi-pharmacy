/**
 * GiDi does not ship in-app purchases. This module is a no-op stub so any
 * leftover imports compile without the react-native-purchases package.
 */
import { useCallback, useState } from 'react';
import { useInAppPurchaseStore } from './store';

export const RETRY_ATTEMPTS = 0;
export const RETRY_DELAY_MS = 0;

export const getRevenueCatAPIKey = (): string | undefined => undefined;

export async function loadOfferings(_setOfferings: (o: any) => void) {}

export async function fetchSubscriptionStatus(setIsSubscribed: (v: boolean) => void) {
  setIsSubscribed(false);
}

export async function initiatePurchases({
  setIsReady,
}: {
  isConfigured: { current: boolean };
  setIsReady: (v: boolean) => void;
  setOfferings: (o: any) => void;
  setIsSubscribed: (v: boolean) => void;
}) {
  setIsReady(true);
}

export function getAvailablePackagesFromOfferings(_offerings: any) {
  return [];
}

export function getSubscriptionsFromOfferings(_offerings: any) {
  return [];
}

export async function executePurchase(_args: { pkg: any; setIsSubscribed: (v: boolean) => void }) {
  return { success: false as const, cancelled: true as const };
}

export async function executeRestore(_setIsSubscribed: (v: boolean) => void) {
  return { success: false as const };
}

export function useInAppPurchase() {
  const { isReady, offerings, setIsSubscribed, isSubscribed, setIsReady, setOfferings } =
    useInAppPurchaseStore();
  const [isPurchasing] = useState(false);

  const initiate = useCallback(
    () =>
      initiatePurchases({
        isConfigured: { current: true },
        setIsReady,
        setOfferings,
        setIsSubscribed,
      }),
    [setIsReady, setOfferings, setIsSubscribed]
  );

  return {
    isReady,
    offerings,
    isSubscribed,
    isPurchasing,
    initiate,
    getAvailablePackages: () => [] as any[],
    getAvailableSubscriptions: () => [] as any[],
    purchasePackage: async () => ({ success: false as const, cancelled: true as const }),
    restorePurchases: async () => ({ success: false as const }),
  };
}

export default useInAppPurchase;
