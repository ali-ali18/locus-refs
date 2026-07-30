"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export interface NoteTrailItem {
  id: string;
  title: string;
  icon: string | null;
}

interface NoteTrailContextValue {
  trail: NoteTrailItem[];
  navigateViaLink: (from: NoteTrailItem, to: NoteTrailItem) => void;
  jumpToTrailIndex: (index: number) => NoteTrailItem | null;
  resetTrail: () => void;
  markLinkNavigation: () => void;
  consumeLinkNavigation: () => boolean;
}

const NoteTrailContext = createContext<NoteTrailContextValue | null>(null);

export function NoteTrailProvider({ children }: { children: React.ReactNode }) {
  const [trail, setTrail] = useState<NoteTrailItem[]>([]);
  const linkNavigationRef = useRef(false);

  const markLinkNavigation = useCallback(() => {
    linkNavigationRef.current = true;
  }, []);

  const consumeLinkNavigation = useCallback(() => {
    if (!linkNavigationRef.current) return false;
    linkNavigationRef.current = false;
    return true;
  }, []);

  const resetTrail = useCallback(() => {
    setTrail((prev) => (prev.length === 0 ? prev : []));
  }, []);

  const navigateViaLink = useCallback(
    (from: NoteTrailItem, to: NoteTrailItem) => {
      linkNavigationRef.current = true;
      setTrail((prev) => {
        let next = prev;

        if (next.length === 0) {
          next = [from];
        } else if (next[next.length - 1]?.id !== from.id) {
          const fromIndex = next.findIndex((item) => item.id === from.id);
          next = fromIndex >= 0 ? next.slice(0, fromIndex + 1) : [from];
        }

        const existingTo = next.findIndex((item) => item.id === to.id);
        if (existingTo >= 0) {
          return next.slice(0, existingTo + 1);
        }

        return [...next, to];
      });
    },
    [],
  );

  const jumpToTrailIndex = useCallback((index: number) => {
    let target: NoteTrailItem | null = null;
    linkNavigationRef.current = true;
    setTrail((prev) => {
      if (index < 0 || index >= prev.length) {
        linkNavigationRef.current = false;
        return prev;
      }
      target = prev[index] ?? null;
      return prev.slice(0, index + 1);
    });
    return target;
  }, []);

  const value = useMemo(
    () => ({
      trail,
      navigateViaLink,
      jumpToTrailIndex,
      resetTrail,
      markLinkNavigation,
      consumeLinkNavigation,
    }),
    [
      trail,
      navigateViaLink,
      jumpToTrailIndex,
      resetTrail,
      markLinkNavigation,
      consumeLinkNavigation,
    ],
  );

  return (
    <NoteTrailContext.Provider value={value}>
      {children}
    </NoteTrailContext.Provider>
  );
}

export function useNoteTrail() {
  const ctx = useContext(NoteTrailContext);
  if (!ctx) {
    throw new Error("useNoteTrail must be used within a NoteTrailProvider");
  }
  return ctx;
}
