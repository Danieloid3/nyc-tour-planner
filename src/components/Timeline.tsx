import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Clock, CheckCircle2, Circle, ChevronDown, Map as MapIcon, Lightbulb, GripVertical } from "lucide-react";
import { allPlaces, CATEGORY_LABELS, type Place, type DayPlan } from "@/data/itinerary";
import { CATEGORY_META } from "@/lib/categories";
import { dayTotalDistance, formatDistance, walkingTime, haversine } from "@/lib/geo";
import type { useProgress } from "@/hooks/use-progress";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  days: DayPlan[];
  onReorderPlaces?: (dayId: string, activeId: string, overId: string) => void;
  onResetOrder?: (dayId: string) => void;
  onSelectDay: (dayId: string) => void;
  onSelectPlace?: (place: Place & { dayId: string }) => void;
  progress: ReturnType<typeof useProgress>;
  selectedDayId: string | null;
  selectedPlaceId?: string | null;
}

const animateLayoutChanges = (args: any) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

// Inner component for sortable item
function SortablePlaceItem({ p, dayId, next, distToNext, progress, onSelectPlace }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: p.id, 
    data: { dayId },
    animateLayoutChanges,
    transition: {
      duration: 400,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || (isDragging ? 'none' : 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)'),
    zIndex: isDragging ? 50 : 1,
    position: isDragging ? 'relative' as const : 'static' as const,
  };

  const PlaceIcon = CATEGORY_META[p.category as keyof typeof CATEGORY_META].icon;
  const visited = progress.isVisited(p.id);

  return (
    <div ref={setNodeRef} style={style} className={`relative z-[${isDragging ? 50 : 1}]`}>
      <div className={`relative flex gap-3 transition-all duration-300 ${visited ? 'opacity-50' : 'opacity-100'} ${isDragging ? 'bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl ring-2 ring-primary/40 p-3 -ml-3 scale-[1.02] rotate-1' : ''}`}>
        
        {/* drag handle */}
        <div className="flex flex-col justify-start pt-1.5" {...attributes} {...listeners} style={{ touchAction: 'none' }}>
          <GripVertical className={`h-5 w-5 cursor-grab active:cursor-grabbing transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground/30 hover:text-foreground'}`} />
        </div>

        {/* Checkbox column (Left) */}
        <div className="flex flex-col items-center pt-0.5">
          <button 
            onClick={() => progress.togglePlace(p.id)}
            className="group/check transition-transform active:scale-95"
          >
            {visited ? (
              <CheckCircle2 className="h-6 w-6 text-primary fill-primary/20" />
            ) : (
            <Circle className="h-6 w-6 text-muted-foreground group-hover/check:text-primary transition-colors" />
          )}
        </button>
        {distToNext !== null && !isDragging && (
          <div className="flex-1 w-0.5 border-l-2 border-dashed border-border my-1 min-h-[1.5rem]" />
        )}
      </div>
      
      {/* Content column (Right) */}
      <div 
        className="flex-1 pb-5 cursor-pointer"
        onClick={() => onSelectPlace?.({ ...p, dayId })}
      >
        <h4 className={`text-[15px] font-bold leading-tight ${visited ? 'line-through text-muted-foreground' : 'text-foreground hover:text-primary transition-colors'}`}>
          {p.order}. {p.name}
        </h4>
        <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
          <PlaceIcon className="h-3.5 w-3.5" /> {CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS]}
        </p>

        {/* Walking distance below */}
        {distToNext !== null && !isDragging && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-bold text-secondary-foreground">
            <Clock className="h-3 w-3" />
            {formatDistance(distToNext)} · {walkingTime(distToNext)}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export function Timeline({ days, onReorderPlaces, onResetOrder, onSelectDay, onSelectPlace, progress, selectedDayId, selectedPlaceId }: Props) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(() => {
    const init = new Set<string>();
    if (selectedDayId) init.add(selectedDayId);
    return init;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires moving 5px before dragging starts, to allow scrolling
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeData = active.data.current;
      if (activeData && activeData.dayId) {
        onReorderPlaces?.(activeData.dayId, active.id as string, over.id as string);
      }
    }
  };

  // Auto-scroll on mount if returning from map
  useEffect(() => {
    const targetId = selectedPlaceId ? `place-${selectedPlaceId}` : (selectedDayId ? `day-${selectedDayId}` : null);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300); // 300ms to allow expanded animation to finish
    }
  }, [selectedPlaceId, selectedDayId]);

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
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Su viaje día a día</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Aquí tienen sus 12 días organizados paso a paso. Toquen cualquier día para ver qué harán, y usen el botón del mapa para guiarse. ¡Si quieren cambiar el plan, solo arrastren los lugares para reordenarlos como prefieran!
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

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-border sm:before:left-[27px]">
            {days.map((t, i) => {
              const dist = dayTotalDistance([...t.places]); // Already sorted by useItinerary
              const cats = Array.from(new Set(t.places.map((p) => p.category))).slice(0, 6);
              
              const dayVisitedCount = t.places.filter(p => progress.isVisited(p.id)).length;
              const dayTotal = t.places.length;
              const isDayCompleted = dayVisitedCount === dayTotal && dayTotal > 0;

              const isExpanded = expandedDays.has(t.id);
              const isSelected = t.id === selectedDayId;

              return (
                <div key={t.id} id={`day-${t.id}`} className="relative flex gap-4" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex-1">
                    <div
                      className={`animate-fade-in-up group w-full overflow-hidden rounded-2xl border text-left shadow-sm transition bg-card ${
                        isSelected ? "" :
                        isDayCompleted ? "border-primary/50 opacity-80" : "border-border"
                      }`}
                      style={(isSelected || isExpanded) ? {
                        borderColor: t.color,
                        boxShadow: `0 0 0 2px ${t.color}40`,
                        backgroundImage: `linear-gradient(${t.color}15, ${t.color}15)`
                      } : undefined}
                    >
                    <div className="h-1.5 w-full" style={{ background: t.color }} />
                    <div onClick={() => toggleExpanded(t.id)} className="p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold leading-tight text-foreground flex items-center gap-2">
                            {t.title}
                            {isDayCompleted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          </h3>
                          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <p className={`mt-2 text-[15px] leading-relaxed text-foreground/85 ${isExpanded ? "" : "line-clamp-2"}`}>{t.description}</p>
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
                        {dist > 0 && (
                          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground">
                            <Clock className="h-4 w-4" /> {formatDistance(dist)} · {walkingTime(dist)}
                          </span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                          <span className="text-muted-foreground uppercase tracking-wider">Progreso</span>
                          <span style={{ color: t.color }}>{dayVisitedCount} de {dayTotal} lugares</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-700 ease-out" 
                            style={{ width: `${(dayVisitedCount / dayTotal) * 100}%`, backgroundColor: t.color }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-1 flex flex-col gap-1">
                        <div 
                          onClick={(e) => { e.stopPropagation(); onSelectDay(t.id); }}
                          className="flex w-full h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-black text-white shadow-md transition hover:opacity-90 active:scale-95 cursor-pointer"
                          style={{ backgroundColor: t.color + "e6" }}
                        >
                          <MapIcon className="h-5 w-5" /> VER RUTA EN EL MAPA
                        </div>
                        {onResetOrder && (
                          <div
                            onClick={(e) => { e.stopPropagation(); onResetOrder(t.id); }}
                            className="text-xs font-bold text-center mt-2 pb-1 cursor-pointer hover:underline opacity-80"
                            style={{ color: t.color }}
                          >
                            Restaurar orden original
                          </div>
                        )}
                      </div>
                    </div>
                  <div 
                    className={`pl-2 sm:pl-6 pr-2 sm:pr-4 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[3000px] pb-4 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                  >
                    <div className="relative ml-1 sm:ml-2 pl-2 sm:pl-4 pb-4">
                      <SortableContext items={t.places.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {t.places.map((p, idx, arr) => {
                          const next = arr[idx + 1];
                          const distToNext = next ? haversine(p, next) : null;

                          return (
                            <SortablePlaceItem 
                              key={p.id}
                              p={p}
                              dayId={t.id}
                              next={next}
                              distToNext={distToNext}
                              progress={progress}
                              onSelectPlace={onSelectPlace}
                            />
                          );
                        })}
                      </SortableContext>
                    </div>
                  </div>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DndContext>

        {/* Reset Progress Button */}
        {progress.visitedIds.size > 0 && (
          <div className="mt-10 mb-8 flex justify-center animate-fade-in">
            <button
              onClick={() => {
                if (window.confirm("¿Están seguros de que quieren borrar todas las palomitas verdes y volver a empezar? Esto no se puede deshacer.")) {
                  progress.clearAll();
                }
              }}
              className="text-xs font-bold text-destructive/80 hover:text-destructive hover:bg-destructive/10 px-5 py-2.5 rounded-full transition-all active:scale-95 border border-transparent hover:border-destructive/20"
            >
              Reiniciar todo el progreso
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
