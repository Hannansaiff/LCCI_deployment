"use client";

import { SessionProvider } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Lang = "en" | "ur";

type LocaleContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, ur?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (en: string) => en,
    };
  }
  return ctx;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("lcci-lang") as Lang | null;
    if (stored === "en" || stored === "ur") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("lcci-lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ur" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);

  const t = useCallback(
    (en: string, ur?: string) => {
      if (lang === "ur" && ur && ur.trim()) return ur;
      return en;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return (
    <SessionProvider>
      <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    </SessionProvider>
  );
}
