import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'ur';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  _hasHydrated: boolean;
  _setHasHydrated: (v: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      _hasHydrated: false,
      _setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    }
  )
);

/**
 * Hook that returns 'en' during SSR/hydration and the persisted language after mount.
 * Prevents React hydration mismatch (Error #418).
 */
export function useHydratedLanguage(): Language {
  const { language, _hasHydrated } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and first client render, always return 'en' to match server
  if (!mounted || !_hasHydrated) return 'en';
  return language;
}