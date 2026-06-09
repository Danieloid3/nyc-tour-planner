import { CATEGORY_LABELS, type Category, type Place } from "@/data/itinerary";

// Distancia Haversine en metros
export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// Tiempo caminando aprox a 4.8 km/h
export function walkingTime(meters: number): string {
  const minutes = Math.round(meters / 80);
  if (minutes < 1) return "menos de 1 min";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} h ${m} min`;
}

export function googleMapsLink(place: { lat: number; lng: number; name: string }): string {
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}

export function googleMapsRouteLink(places: Place[]): string {
  if (places.length === 0) return "https://www.google.com/maps";
  const coords = places.map((p) => `${p.lat},${p.lng}`);
  const origin = coords[0];
  const destination = coords[coords.length - 1];
  const waypoints = coords.slice(1, -1).join("|");
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
  if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
  return url;
}

export function tourTotalDistance(places: Place[]): number {
  let total = 0;
  for (let i = 0; i < places.length - 1; i++) total += haversine(places[i], places[i + 1]);
  return total;
}

export function categoryLabel(c: Category): string {
  return CATEGORY_LABELS[c];
}
