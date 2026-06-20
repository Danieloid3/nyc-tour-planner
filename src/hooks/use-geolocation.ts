import { useState, useEffect, useRef } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

// ~5 meters in degrees — skip update if position hasn't meaningfully changed
const MIN_DELTA = 0.00005;

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
    loading: true,
  });

  // Keep last coords in a ref so we can compare without triggering re-renders
  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState((s) => ({
        ...s,
        error: "Geolocalización no soportada por tu navegador",
        loading: false,
      }));
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;

        // Skip update if position hasn't meaningfully changed (GPS jitter)
        if (lastCoordsRef.current) {
          const dLat = Math.abs(newLat - lastCoordsRef.current.lat);
          const dLng = Math.abs(newLng - lastCoordsRef.current.lng);
          if (dLat < MIN_DELTA && dLng < MIN_DELTA) return;
        }

        lastCoordsRef.current = { lat: newLat, lng: newLng };
        setState({
          lat: newLat,
          lng: newLng,
          accuracy: pos.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (err) => {
        let msg = "No se pudo obtener la ubicación";
        if (err.code === 1) msg = "Permiso de ubicación denegado";
        if (err.code === 2) msg = "Ubicación no disponible";
        if (err.code === 3) msg = "Tiempo de espera agotado";

        setState((s) => ({
          ...s,
          error: msg,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000, // Up from 5000 — reduces OS callback rate
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return state;
}

