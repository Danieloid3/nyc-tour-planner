import { X, MapPin, ArrowRight, ExternalLink, Eye, Utensils, Gauge, Footprints } from "lucide-react";
import { tours, CATEGORY_LABELS, type Place } from "@/data/itinerary";
import { CATEGORY_META } from "@/lib/categories";
import { googleMapsLink, haversine, formatDistance, walkingTime } from "@/lib/geo";

interface Props {
  place: (Place & { tourId: string }) | null;
  onClose: () => void;
  onFocusTour: (tourId: string) => void;
}

export function PlaceDetail({ place, onClose, onFocusTour }: Props) {
  if (!place) return null;
  const tour = tours.find((t) => t.id === place.tourId)!;
  const meta = CATEGORY_META[place.category];
  const Icon = meta.icon;
  const ordered = [...tour.places].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.id === place.id);
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;
  const dist = next ? haversine(place, next) : null;

  return (
    <aside className="animate-slide-in-right pointer-events-auto flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[360px]">
      <div className="relative px-5 pt-5 pb-4" style={{ background: `linear-gradient(135deg, ${tour.color}22, transparent)` }}>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/70 text-muted-foreground transition hover:bg-background hover:text-foreground"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span
            className="grid h-10 w-10 place-items-center rounded-xl text-white shadow"
            style={{ background: tour.color }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {CATEGORY_LABELS[place.category]}
            </span>
            <h2 className="text-lg font-bold leading-tight text-foreground">{place.name}</h2>
          </div>
        </div>
        <button
          onClick={() => onFocusTour(tour.id)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
          style={{ background: tour.color }}
        >
          Tour {tour.number}: {tour.title}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="thin-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4">
        <p className="text-sm leading-relaxed text-foreground/90">{place.description}</p>

        {place.seeWhat && place.seeWhat.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> Qué ver
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {place.seeWhat.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {place.food && (
          <div className="rounded-xl bg-secondary/60 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Utensils className="h-3.5 w-3.5" /> Comida recomendada
            </h3>
            <p className="text-sm text-foreground/90">{place.food}</p>
          </div>
        )}

        {next && dist !== null && (
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <Footprints className="h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {formatDistance(dist)} · {walkingTime(dist)} a pie
              </p>
              <p className="text-xs text-muted-foreground">Siguiente: {next.name}</p>
            </div>
          </div>
        )}

        {tour.pace && (
          <div className="rounded-xl bg-accent/50 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" /> Nota de ritmo
            </h3>
            <p className="text-sm text-foreground/90">{tour.pace}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border p-3">
        <a
          href={googleMapsLink(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          <MapPin className="h-4 w-4" /> Ver lugar
        </a>
        <button
          onClick={() => onFocusTour(tour.id)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" /> Abrir ruta
        </button>
      </div>
    </aside>
  );
}
