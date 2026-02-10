"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface PreviewState {
  code: string;
  language: string;
}

interface PreviewContextType {
  preview: PreviewState | null;
  openPreview: (code: string, language: string) => void;
  closePreview: () => void;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const openPreview = useCallback((code: string, language: string) => {
    setPreview({ code, language });
  }, []);

  const closePreview = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <PreviewContext.Provider value={{ preview, openPreview, closePreview }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error("usePreview must be used within PreviewProvider");
  return ctx;
}
