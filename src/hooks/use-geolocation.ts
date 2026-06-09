import { useState, useEffect } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
    loading: true,
  });

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
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
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
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return state;
}
