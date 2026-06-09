import { ArrowRight, MapPin, Clock } from "lucide-react";
import { tours } from "@/data/itinerary";
import { CATEGORY_META } from "@/lib/categories";
import { tourTotalDistance, formatDistance, walkingTime } from "@/lib/geo";

interface Props {
  onSelectTour: (tourId: string) => void;
}

export function Timeline({ onSelectTour }: Props) {
  return (
    <div className="thin-scroll h-full overflow-y-auto bg-background px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Cronología del viaje</h2>
          <p className="text-sm text-muted-foreground">
            12 tours organizados por jornadas. Pulsa una tarjeta para verla en el mapa.
          </p>
        </div>

        <div className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-border sm:before:left-[27px]">
          {tours.map((t, i) => {
            const dist = tourTotalDistance([...t.places].sort((a, b) => a.order - b.order));
            const cats = Array.from(new Set(t.places.map((p) => p.category))).slice(0, 6);
            return (
              <div key={t.id} className="relative flex gap-4" style={{ animationDelay: `${i * 40}ms` }}>
                <div
                  className="z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white shadow-lg sm:h-14 sm:w-14"
                  style={{ background: t.color }}
                >
                  {t.number}
                </div>
                <button
                  onClick={() => onSelectTour(t.id)}
                  className="animate-fade-in-up group flex-1 overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="h-1.5 w-full" style={{ background: t.color }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold leading-tight text-foreground">{t.title}</h3>
                        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{t.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex -space-x-1">
                        {cats.map((c) => (
                          <span
                            key={c}
                            className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-secondary text-sm"
                            title={c}
                          >
                            {CATEGORY_META[c].emoji}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {t.places.length} lugares
                      </span>
                      {dist > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {formatDistance(dist)} · {walkingTime(dist)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
