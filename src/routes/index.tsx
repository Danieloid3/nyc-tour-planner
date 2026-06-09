import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Map as MapIcon, ListOrdered, Moon, Sun, Compass, SlidersHorizontal } from "lucide-react";
import { allPlaces, days, type Place } from "@/data/itinerary";
import { useTheme } from "@/hooks/use-theme";
import MapView from "@/components/map/MapView";
import { Sidebar } from "@/components/Sidebar";
import { Timeline } from "@/components/Timeline";
import { PlaceDetail } from "@/components/PlaceDetail";
import { LocationWidget } from "@/components/map/LocationWidget";
import * as Popover from "@radix-ui/react-popover";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useProgress } from "@/hooks/use-progress";
import { WeatherWidget } from "@/components/WeatherWidget";
import Onboarding from "@/components/Onboarding";
import { haversine } from "@/lib/geo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa de Viaje · Nueva York Familiar" },
      {
        name: "description",
        content:
          "Mapa interactivo del itinerario familiar de Nueva York y Stamford: 12 días, miradores, museos, parques y rutas a pie.",
      },
      { property: "og:title", content: "Mapa de Viaje · Nueva York Familiar" },
      {
        property: "og:description",
        content: "Explora 12 días de itinerario por Nueva York con rutas, miradores, museos y comida recomendada.",
      },
    ],
  }),
  component: Index,
});

const ALL_DAY_IDS = new Set(days.map((t) => t.id));

function Index() {
  const { theme, toggle } = useTheme();
  // La vista principal por defecto ahora es la lista de días (timeline)
  const [view, setView] = useState<"map" | "timeline">("timeline");
  // Por defecto, solo el Día 1 está activo en el mapa para evitar saturación de puntos
  const [activeDayIds, setActiveDayIds] = useState<Set<string>>(new Set([days[0].id]));
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<(Place & { dayId: string }) | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [mapInstance, setMapInstance] = useState<any>(null);

  const userLocation = useGeolocation();
  const progress = useProgress();

  const filterMatchIds = useMemo(() => {
    if (activeCategories.size === 0) return null;
    return new Set(allPlaces.filter((p) => activeCategories.has(p.category)).map((p) => p.id));
  }, [activeCategories]);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Android back button support for Place Modal
  useEffect(() => {
    if (selectedPlace && window.location.hash !== '#place') {
      window.history.pushState(null, '', window.location.pathname + window.location.search + '#place');
    } else if (!selectedPlace && window.location.hash === '#place') {
      window.history.back();
    }
  }, [selectedPlace]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash !== '#place' && selectedPlace) {
        setSelectedPlace(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [selectedPlace]);

  const selectPlace = (p: (Place & { dayId: string }) | null) => {
    setSelectedPlace(p);
    if (p) setView("map");
  };

  const toggleDay = (id: string) =>
    setActiveDayIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const focusDay = (id: string | null) => {
    setSelectedDayId(id);
    if (id) {
      setActiveDayIds((prev) => new Set(prev).add(id));
      setView("map");
    }
  };

  useEffect(() => {
    // Removed unstable history listeners to prevent router conflicts
  }, []);



  const closePlace = () => {
    setSelectedPlace(null);
  };

  const centerOnUser = () => {
    if (mapInstance && userLocation.lat && userLocation.lng) {
      mapInstance.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 0.8 });
    }
  };

  const targetPlace = useMemo(() => {
    if (selectedPlace) return selectedPlace;
    if (selectedDayId && userLocation.lat && userLocation.lng) {
      const day = days.find((d) => d.id === selectedDayId);
      if (day) {
        let closest = null;
        let minDist = Infinity;
        for (const p of day.places) {
          const dist = haversine(
            { lat: userLocation.lat, lng: userLocation.lng },
            p
          );
          if (dist < minDist) {
            minDist = dist;
            closest = p;
          }
        }
        return closest;
      }
    }
    return null;
  }, [selectedPlace, selectedDayId, userLocation.lat, userLocation.lng]);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
      <Onboarding />
      {/* Floating Top Bar */}
      <header className="absolute left-4 right-4 top-4 z-[1000] flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Side: Logo & Title inside a glass pill */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-border/50 bg-background/85 px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm backdrop-blur-xl">
          <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg sm:rounded-xl bg-primary text-primary-foreground shadow">
            <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
          <div className="pr-1 leading-tight">
            <h1 className="text-xs sm:text-sm font-black tracking-tight text-foreground">NYC Familiar</h1>
            <p className="hidden text-[10px] font-semibold text-muted-foreground sm:block">12 días de viaje</p>
          </div>
        </div>

        {/* Right Side: Tools inside glass pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                className="flex items-center gap-2 rounded-xl sm:rounded-2xl border border-border/50 bg-background/85 px-2.5 py-2 sm:px-3 sm:py-2.5 text-sm font-bold shadow-sm backdrop-blur-xl transition hover:bg-background active:scale-95"
                aria-label="Filtros y Días"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="hidden sm:inline">Días y Filtros</span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[2000] w-[calc(100vw-32px)] sm:w-[380px] origin-top animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 overflow-hidden rounded-[28px] border border-border bg-background/95 shadow-2xl backdrop-blur-2xl mt-2"
                align="center"
                sideOffset={5}
                collisionPadding={16}
              >
                <div className="flex h-[70vh] max-h-[600px] flex-col overflow-hidden p-5">
                  <Sidebar
                    activeCategories={activeCategories}
                    onToggleCategory={toggleCategory}
                    activeDayIds={activeDayIds}
                    onToggleDay={toggleDay}
                    selectedDayId={selectedDayId}
                    onFocusDay={focusDay}
                    showRoutes={showRoutes}
                    onToggleRoutes={() => setShowRoutes((v) => !v)}
                    onShowAll={() => setActiveDayIds(new Set(ALL_DAY_IDS))}
                    onHideAll={() => {
                      setActiveDayIds(new Set());
                      setSelectedDayId(null);
                    }}
                  />
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <div className="flex items-center gap-1.5 sm:gap-2">

            <WeatherWidget />

            <button
              onClick={toggle}
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl sm:rounded-2xl border border-border/50 bg-background/85 text-foreground shadow-sm backdrop-blur-xl transition hover:bg-background active:scale-95"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-1 w-full overflow-hidden">
        {view === "map" ? (
          <>
            <MapView
              theme={theme}
              activeDayIds={activeDayIds}
              selectedDayId={selectedDayId}
              selectedPlaceId={selectedPlace?.id ?? null}
              showRoutes={showRoutes}
              searchMatchIds={filterMatchIds}
              userLocation={userLocation}
              visitedIds={progress.visitedIds}
              onMapInstance={setMapInstance}
              onSelectPlace={selectPlace}
            />
            {/* Location Tracking Widget */}
            <LocationWidget 
              userLocation={userLocation} 
              targetPlace={targetPlace} 
              onCenter={centerOnUser} 
            />
            {/* PlaceDetail is now a Vaul Drawer that handles its own portals and overlay */}
            <PlaceDetail 
              place={selectedPlace} 
              onClose={closePlace} 
              onFocusDay={focusDay} 
              userLocation={userLocation}
              progress={progress}
            />
          </>
        ) : (
          <div className="h-full w-full overflow-y-auto thin-scroll pt-24 px-4 pb-12">
             <div className="mx-auto max-w-4xl">
               <Timeline 
                 onSelectDay={(id) => focusDay(id)} 
                 onSelectPlace={selectPlace}
                 progress={progress} 
                 selectedDayId={selectedDayId} 
               />
             </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for View Toggle */}
      <div className="pointer-events-none fixed bottom-8 left-0 right-0 z-[1500] flex justify-center">
        <button
          onClick={() => setView(view === "map" ? "timeline" : "map")}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-bold text-background shadow-2xl transition hover:scale-105 active:scale-95"
        >
          {view === "map" ? (
            <>
              <ListOrdered className="h-4 w-4" /> Mostrar lista
            </>
          ) : (
            <>
              <MapIcon className="h-4 w-4" /> Mostrar mapa
            </>
          )}
        </button>
      </div>
    </div>
  );
}
