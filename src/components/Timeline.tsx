import { useState } from "react";
import { ArrowRight, MapPin, Clock, CheckCircle2, Circle, ChevronDown, Map as MapIcon, Lightbulb } from "lucide-react";
import { days, allPlaces, CATEGORY_LABELS } from "@/data/itinerary";
import { CATEGORY_META } from "@/lib/categories";
import { dayTotalDistance, formatDistance, walkingTime, haversine } from "@/lib/geo";
import type { useProgress } from "@/hooks/use-progress";

interface Props {
  onSelectDay: (dayId: string) => void;
  progress: ReturnType<typeof useProgress>;
  selectedDayId: string | null;
}

export function Timeline({ onSelectDay, progress, selectedDayId }: Props) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set()); // All days collapsed by default

  const toggleExpanded = (id: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalPlaces = allPlaces.length;
  const totalVisited = progress.visitedIds.size;
  const totalPercent = Math.round((totalVisited / totalPlaces) * 100) || 0;
  return (
    <div className="thin-scroll h-full overflow-y-auto bg-background px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Cronología del viaje</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            12 días organizados por jornadas. Pulsa un día para desplegar sus actividades, y usa el botón del mapa para ver su ruta.
          </p>
          
          {/* Global Progress */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-end justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm">Progreso del viaje</h3>
                <p className="text-xs text-muted-foreground">{totalVisited} de {totalPlaces} lugares visitados</p>
              </div>
              <span className="text-xl font-black text-primary">{totalPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${totalPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-border sm:before:left-[27px]">
          {days.map((t, i) => {
            const dist = dayTotalDistance([...t.places].sort((a, b) => a.order - b.order));
            const cats = Array.from(new Set(t.places.map((p) => p.category))).slice(0, 6);
            
            const dayVisitedCount = t.places.filter(p => progress.isVisited(p.id)).length;
            const dayTotal = t.places.length;
            const isDayCompleted = dayVisitedCount === dayTotal && dayTotal > 0;

            const isExpanded = expandedDays.has(t.id);
            const isSelected = t.id === selectedDayId;

            return (
              <div key={t.id} className="relative flex gap-4" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex-1">
                  <button
                    onClick={() => toggleExpanded(t.id)}
                    className={`animate-fade-in-up group w-full overflow-hidden rounded-2xl border text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl bg-card ${
                      isSelected ? "" :
                      isDayCompleted ? "border-primary/50 opacity-80" : "border-border"
                    }`}
                    style={isSelected ? {
                      borderColor: t.color,
                      boxShadow: `0 0 0 2px ${t.color}40`,
                      backgroundImage: `linear-gradient(${t.color}15, ${t.color}15)`
                    } : undefined}
                  >
                  <div className="h-1.5 w-full" style={{ background: t.color }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold leading-tight text-foreground flex items-center gap-2">
                          {t.title}
                          {isDayCompleted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </h3>
                        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          onClick={(e) => { e.stopPropagation(); onSelectDay(t.id); }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          title="Ver ruta en mapa"
                        >
                          <MapIcon className="h-4 w-4" />
                        </div>
                        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <p className={`mt-2 text-sm text-foreground/80 ${isExpanded ? "" : "line-clamp-2"}`}>{t.description}</p>
                    {isExpanded && t.pace && (
                      <div className="mt-3 animate-fade-in-up rounded-xl bg-accent/30 p-3 border border-accent/50 text-[13px] text-foreground/90 font-medium flex gap-2 items-start shadow-sm">
                        <Lightbulb className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                        <span>
                          <strong className="text-foreground">Ritmo sugerido:</strong> {t.pace}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex -space-x-1">
                        {cats.map((c) => {
                          const Icon = CATEGORY_META[c].icon;
                          return (
                            <span
                              key={c}
                              className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-secondary text-sm"
                              title={c}
                            >
                              <Icon className="h-3.5 w-3.5 text-secondary-foreground" />
                            </span>
                          );
                        })}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                        {dayVisitedCount} / {dayTotal} completados
                      </span>
                      {dist > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {formatDistance(dist)} · {walkingTime(dist)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                
                {/* List of places for the day (expandable accordion) */}
                <div 
                  className={`pl-8 sm:pl-12 pr-2 sm:pr-4 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] mt-4 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                >
                  {/* Map Button at top of expanded list */}
                  <div className="pt-1 pb-5 flex justify-start">
                    <button 
                      onClick={() => onSelectDay(t.id)}
                      className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-[13px] font-bold text-primary hover:bg-primary/20 transition-colors"
                    >
                      <MapIcon className="h-4 w-4" /> Ver ruta en el mapa
                    </button>
                  </div>
                  
                  <div className="space-y-4 pb-4">
                    {[...t.places].sort((a, b) => a.order - b.order).map((p, idx, arr) => {
                    const next = arr[idx + 1];
                    const distToNext = next ? haversine(p, next) : null;
                    const PlaceIcon = CATEGORY_META[p.category].icon;
                    const visited = progress.isVisited(p.id);

                    return (
                      <div key={p.id} className={`relative transition-opacity ${visited ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="flex items-start gap-3">
                          
                          {/* Checkbox Button */}
                          <button 
                            onClick={() => progress.togglePlace(p.id)}
                            className="relative mt-0.5 flex flex-col items-center group/check"
                          >
                            {visited ? (
                              <CheckCircle2 className="h-6 w-6 text-primary fill-primary/20" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground group-hover/check:text-primary transition" />
                            )}
                            {distToNext !== null && (
                              <div className="my-1 h-10 w-0.5 border-l-2 border-dashed border-border" />
                            )}
                          </button>
                          
                          <div className="flex-1 pb-4">
                            <h4 className={`text-sm font-bold ${visited ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {p.order}. {p.name}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <PlaceIcon className="h-3 w-3" /> {CATEGORY_LABELS[p.category]}
                            </p>
                          </div>
                        </div>
                        {distToNext !== null && (
                          <div className="absolute left-7 top-10 flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistance(distToNext)} · {walkingTime(distToNext)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
