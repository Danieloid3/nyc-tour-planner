import { Navigation, MapPin, Route, Loader2 } from "lucide-react";
import type { Place } from "@/data/itinerary";
import type { GeolocationState } from "@/hooks/use-geolocation";
import { haversine, formatDistance, walkingTime } from "@/lib/geo";

interface Props {
  userLocation: GeolocationState;
  targetPlace: Place | null;
  onCenter: () => void;
  onTargetClick?: (place: Place) => void;
}

export function LocationWidget({ userLocation, targetPlace, onCenter, onTargetClick }: Props) {
  // If we have a target place and a valid user location, calculate distance
  const distance =
    userLocation.lat && userLocation.lng && targetPlace
      ? haversine(userLocation as { lat: number; lng: number }, targetPlace)
      : null;

  return (
    <>
      {/* Target Distance Panel (Moved Up to avoid central button) */}
      {distance !== null && targetPlace && (
        <div className="fixed bottom-[130px] right-4 z-[1000] flex flex-col items-end pointer-events-none">
          <button 
            onClick={() => onTargetClick?.(targetPlace)}
            className="pointer-events-auto w-[200px] animate-fade-in-up rounded-2xl border border-border/50 bg-card p-3 shadow-xl transition hover:bg-muted active:scale-95 text-left"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold line-clamp-1">{targetPlace.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <Route className="h-3.5 w-3.5" /> {formatDistance(distance)}
              </span>
              <span>{walkingTime(distance)}</span>
            </div>
          </button>
        </div>
      )}

      {/* Center on User Button & Error (Kept at bottom right) */}
      <div className="fixed bottom-8 right-4 z-[1000] flex flex-col items-end gap-3 pointer-events-none">
        <button
          onClick={onCenter}
          disabled={userLocation.loading || !!userLocation.error}
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-border/50 bg-card text-foreground shadow-xl transition hover:bg-muted active:scale-90 disabled:opacity-50"
          aria-label="Mi ubicación"
        >
          {userLocation.loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Navigation
              className={`h-5 w-5 ${
                userLocation.lat ? "text-primary fill-primary/20" : "text-muted-foreground"
              }`}
              style={{ transform: "rotate(45deg)" }}
            />
          )}
        </button>

        {/* Error Message Tooltip (Optional, just a small alert if needed) */}
        {userLocation.error && (
          <div className="pointer-events-auto rounded-lg bg-destructive/10 px-2 py-1 text-[10px] font-bold text-destructive">
            {userLocation.error}
          </div>
        )}
      </div>
    </>
  );
}
