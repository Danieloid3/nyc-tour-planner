import { useState, useEffect, useCallback, useMemo } from "react";
import { days as initialDays, type Place } from "@/data/itinerary";
import { arrayMove } from "@dnd-kit/sortable";

const STORAGE_KEY = "nyc-tour-itinerary-order";

// Type for storing custom orders: Record<dayId, string[]>
type CustomOrders = Record<string, string[]>;

export function useItinerary() {
  const [customOrders, setCustomOrders] = useState<CustomOrders>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as CustomOrders;
    } catch (e) {
      console.warn("Failed to load itinerary order from localStorage", e);
    }
    return {};
  });

  // Sync to local storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customOrders));
    } catch (e) {
      console.warn("Failed to save itinerary order to localStorage", e);
    }
  }, [customOrders]);

  // Compute final days based on custom orders
  const activeDays = useMemo(() => {
    return initialDays.map((day) => {
      const order = customOrders[day.id];
      if (!order) return day;

      // Create a map for quick lookup
      const placeMap = new Map<string, Place>(day.places.map(p => [p.id, p]));
      
      const sortedPlaces: Place[] = [];
      
      // First, add places in the custom order
      for (const placeId of order) {
        const place = placeMap.get(placeId);
        if (place) {
          sortedPlaces.push(place);
          placeMap.delete(placeId);
        }
      }
      
      // Then, add any remaining places (in case new ones were added to the source data)
      // They are added at the end by default
      for (const place of placeMap.values()) {
        sortedPlaces.push(place);
      }
      
      // Finally, re-assign the `order` property so it displays correctly as 1. 2. 3.
      const placesWithNewIndices = sortedPlaces.map((p, index) => ({
        ...p,
        order: index + 1
      }));

      return {
        ...day,
        places: placesWithNewIndices
      };
    });
  }, [customOrders]);

  const reorderPlaces = useCallback((dayId: string, activeId: string, overId: string) => {
    setCustomOrders(prev => {
      // Get the current order for this day, or fallback to default
      const currentOrder = prev[dayId] || initialDays.find(d => d.id === dayId)?.places.sort((a,b) => a.order - b.order).map(p => p.id) || [];
      
      const oldIndex = currentOrder.indexOf(activeId);
      const newIndex = currentOrder.indexOf(overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      
      return {
        ...prev,
        [dayId]: newOrder
      };
    });
  }, []);

  const resetOrder = useCallback((dayId: string) => {
    setCustomOrders(prev => {
      const next = { ...prev };
      delete next[dayId];
      return next;
    });
  }, []);

  return {
    days: activeDays,
    reorderPlaces,
    resetOrder
  };
}
