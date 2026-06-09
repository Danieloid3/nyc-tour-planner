import { Drawer } from "vaul";
import { ArrowRight, MapPin, Navigation, Eye, Utensils, Gauge, Footprints, Train, ImageIcon, CheckCircle2, Circle, Lightbulb } from "lucide-react";
import { days, CATEGORY_LABELS, type Place } from "@/data/itinerary";
import { CATEGORY_META } from "@/lib/categories";
import { googleMapsLink, googleMapsNavigationLink, haversine, formatDistance, walkingTime, transitTime } from "@/lib/geo";
import type { GeolocationState } from "@/hooks/use-geolocation";
import type { useProgress } from "@/hooks/use-progress";
import { usePlaceImages } from "@/hooks/use-place-images";

interface Props {
  place: (Place & { dayId: string }) | null;
  onClose: () => void;
  onFocusDay: (dayId: string) => void;
  userLocation?: GeolocationState;
  progress: ReturnType<typeof useProgress>;
}

export function PlaceDetail({ place, onClose, onFocusDay, userLocation, progress }: Props) {
  const isOpen = !!place;

  if (!place) {
    return (
      <Drawer.Root open={false} onOpenChange={onClose}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex h-auto max-h-[90vh] flex-col rounded-t-[32px] bg-background outline-none">
            <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted" />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  const day = days.find((t) => t.id === place.dayId)!;
  const meta = CATEGORY_META[place.category];
  const Icon = meta.icon;
  const ordered = [...day.places].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.id === place.id);
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;
  const distToNext = next ? haversine(place, next) : null;

  const userDist =
    userLocation?.lat && userLocation?.lng
      ? haversine({ lat: userLocation.lat, lng: userLocation.lng }, place)
      : null;

  const origin = userLocation?.lat && userLocation?.lng 
    ? { lat: userLocation.lat, lng: userLocation.lng } 
    : null;

  const { images, loading } = usePlaceImages(place?.name);
  const mainImage = images.length > 0 ? images[0] : null;
  const galleryImages = images.length > 1 ? images.slice(1) : [];

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-all" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[9999] mt-24 flex h-[85vh] flex-col rounded-t-[32px] border-t border-border bg-card shadow-[0_-10px_40px_rgba(0,0,0,0.1)] outline-none sm:mx-auto sm:max-w-md overflow-hidden">
          {/* Header background with image */}
          <div 
            className="absolute top-0 left-0 right-0 h-[220px] transition-all duration-500 bg-muted"
            style={{ 
              backgroundImage: mainImage ? `url(${mainImage.thumb})` : `linear-gradient(180deg, ${day.color}30, transparent)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-card" />
            
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/20 animate-pulse">
                <ImageIcon className="h-8 w-8 text-white/30" />
              </div>
            )}
          </div>

          <div className="relative z-10 mx-auto mt-3 mb-2 h-1.5 w-12 flex-shrink-0 rounded-full bg-white/40 shadow-sm" />
          
          <div className="flex-1 overflow-y-auto thin-scroll pb-36">
            <div className="relative px-6 pt-16 pb-5">
              <div className="flex items-start gap-4">
                <span
                  className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-md"
                  style={{ background: day.color }}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80 drop-shadow-md">
                    {CATEGORY_LABELS[place.category]}
                  </span>
                  <Drawer.Title className="text-2xl font-black leading-tight text-white drop-shadow-md">
                    {place.name}
                  </Drawer.Title>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onFocusDay(day.id), 300);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90 shadow-sm"
                style={{ background: day.color }}
              >
                Día {day.number}: {day.title}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-6 px-6 pt-4">
              <p className="text-[15px] leading-relaxed text-foreground/90 font-medium">{place.description}</p>

              {galleryImages.length > 0 && (
                <div className="w-full">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <ImageIcon className="h-4 w-4" /> Galería
                  </h3>
                  <div className="flex w-full gap-3 overflow-x-auto pb-4 snap-x thin-scroll">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="snap-center shrink-0 w-[140px] h-[100px] overflow-hidden rounded-2xl bg-muted shadow-sm relative group">
                        <img 
                          src={img.thumb} 
                          alt={`${place.name} - ${i+1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {place.seeWhat && place.seeWhat.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Eye className="h-4 w-4" /> Qué ver
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {place.seeWhat.map((s) => (
                      <span key={s} className="rounded-xl bg-secondary px-3 py-1.5 text-[13px] font-bold text-secondary-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {place.food && (
                <div className="rounded-2xl bg-secondary/50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <Utensils className="h-4 w-4" /> Comida
                  </h3>
                  <p className="text-[14px] text-foreground/90 leading-relaxed font-medium">{place.food}</p>
                </div>
              )}

              {next && distToNext !== null && (
                <div className="flex items-center gap-3 rounded-2xl border border-border p-4 bg-background/50">
                  <Footprints className="h-6 w-6 shrink-0 text-primary" />
                  <div className="text-sm">
                    <p className="font-bold text-foreground">
                      {formatDistance(distToNext)} · {walkingTime(distToNext)} a pie
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">Siguiente: {next.name}</p>
                  </div>
                </div>
              )}

              {userDist !== null && (
                <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                    <Navigation className="h-4 w-4" /> Desde tu ubicación
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-foreground">{formatDistance(userDist)}</span>
                    </div>
                    <div className="flex gap-4 text-sm font-semibold text-foreground/80">
                      <div className="flex items-center gap-1">
                        <Footprints className="h-4 w-4 text-muted-foreground" /> {walkingTime(userDist)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Train className="h-4 w-4 text-muted-foreground" /> {transitTime(userDist)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {place.curiosity && (
                <div className="rounded-2xl bg-accent/30 p-4 border border-accent/50 shadow-sm">
                  <h3 className="mb-2 flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-primary">
                    <Lightbulb className="h-4 w-4" /> ¿Sabías que...?
                  </h3>
                  <p className="text-[14px] text-foreground/90 leading-relaxed font-medium italic">{place.curiosity}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions Area */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 p-4 pt-3 pb-6 backdrop-blur-xl">
            
            <button
              onClick={() => progress.togglePlace(place.id)}
              className={`mb-3 flex w-full h-12 items-center justify-center gap-2 rounded-2xl font-bold shadow transition active:scale-95 ${
                progress.isVisited(place.id) 
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-transparent" 
                  : "bg-background text-foreground border-2 border-primary hover:bg-primary/10"
              }`}
            >
              {progress.isVisited(place.id) ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Marcado como visitado
                </>
              ) : (
                <>
                  <Circle className="h-5 w-5 text-primary" /> Marcar como visitado
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
            <a
              href={googleMapsLink(place)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background px-2 sm:px-4 text-sm font-bold text-foreground transition hover:bg-secondary active:scale-[0.98]"
            >
              <MapPin className="h-4 w-4" /> Google Maps
            </a>
            <a
              href={googleMapsNavigationLink(place, origin)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-2 sm:px-4 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" /> Iniciar ruta
            </a>
          </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
