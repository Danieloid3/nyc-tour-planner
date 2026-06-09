import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nyc-tour-progress";

export function useProgress() {
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set<string>();
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored) as string[]);
      }
    } catch (e) {
      console.warn("Failed to load progress from localStorage", e);
    }
    return new Set<string>();
  });

  const togglePlace = useCallback((placeId: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else {
        next.add(placeId);
      }
      return next;
    });
  }, []);

  const markVisited = useCallback((placeId: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      next.add(placeId);
      return next;
    });
  }, []);

  const unmarkVisited = useCallback((placeId: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      next.delete(placeId);
      return next;
    });
  }, []);

  const isVisited = useCallback((placeId: string) => {
    return visitedIds.has(placeId);
  }, [visitedIds]);

  // Sync to local storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visitedIds)));
    } catch (e) {
      console.warn("Failed to save progress to localStorage", e);
    }
  }, [visitedIds]);

  const clearAll = useCallback(() => {
    setVisitedIds(new Set());
  }, []);

  return {
    visitedIds,
    togglePlace,
    markVisited,
    unmarkVisited,
    isVisited,
    clearAll,
  };
}
