import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Map as MapIcon, ListOrdered, Moon, Sun, Menu, Compass } from "lucide-react";
import { allPlaces, tours, type Place } from "@/data/itinerary";
import { useTheme } from "@/hooks/use-theme";
import MapView from "@/components/map/MapView";
import { Sidebar } from "@/components/Sidebar";
import { Timeline } from "@/components/Timeline";
import { PlaceDetail } from "@/components/PlaceDetail";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa de Viaje · Nueva York Familiar" },
      {
        name: "description",
        content:
          "Mapa interactivo del itinerario familiar de Nueva York y Stamford: 12 tours, miradores, museos, parques y rutas a pie.",
      },
      { property: "og:title", content: "Mapa de Viaje · Nueva York Familiar" },
      {
        property: "og:description",
        content: "Explora 12 tours por Nueva York con rutas, miradores, museos y comida recomendada.",
      },
    ],
  }),
  component: Index,
});

const ALL_TOUR_IDS = new Set(tours.map((t) => t.id));

function Index() {
  const { theme, toggle } = useTheme();
  const [view, setView] = useState<"map" | "timeline">("map");
  const [activeTourIds, setActiveTourIds] = useState<Set<string>>(new Set(ALL_TOUR_IDS));
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<(Place & { tourId: string }) | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchMatchIds = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return new Set(allPlaces.filter((p) => p.name.toLowerCase().includes(q)).map((p) => p.id));
  }, [search]);

  const toggleTour = (id: string) =>
    setActiveTourIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const focusTour = (id: string | null) => {
    setSelectedTourId(id);
    if (id) {
      setActiveTourIds((prev) => new Set(prev).add(id));
      setView("map");
      setSidebarOpen(false);
    }
  };

  const selectPlace = (p: Place & { tourId: string }) => {
    setSelectedPlace(p);
    setView("map");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <header className="z-30 flex items-center justify-between gap-3 border-b border-border bg-card px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground transition hover:bg-secondary lg:hidden"
            aria-label="Menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow">
            <Compass className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <h1 className="text-sm font-extrabold tracking-tight text-foreground sm:text-base">Nueva York Familiar</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Mapa de viaje interactivo · 12 tours</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-border bg-background p-0.5">
            <button
              onClick={() => setView("map")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                view === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapIcon className="h-4 w-4" /> <span className="hidden sm:inline">Mapa</span>
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                view === "timeline" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListOrdered className="h-4 w-4" /> <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>
          <button
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground transition hover:bg-secondary"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`absolute inset-y-0 left-0 z-20 w-[300px] border-r border-border bg-sidebar p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <Sidebar
            search={search}
            onSearch={setSearch}
            activeTourIds={activeTourIds}
            onToggleTour={toggleTour}
            selectedTourId={selectedTourId}
            onFocusTour={focusTour}
            showRoutes={showRoutes}
            onToggleRoutes={() => setShowRoutes((v) => !v)}
            onShowAll={() => setActiveTourIds(new Set(ALL_TOUR_IDS))}
            onHideAll={() => {
              setActiveTourIds(new Set());
              setSelectedTourId(null);
            }}
          />
        </aside>

        {sidebarOpen && (
          <div className="absolute inset-0 z-10 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <main className="relative flex-1 overflow-hidden">
          {view === "map" ? (
            <>
              <MapView
                theme={theme}
                activeTourIds={activeTourIds}
                selectedTourId={selectedTourId}
                selectedPlaceId={selectedPlace?.id ?? null}
                showRoutes={showRoutes}
                searchMatchIds={searchMatchIds}
                onSelectPlace={selectPlace}
              />
              {selectedPlace && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 sm:inset-auto sm:right-4 sm:top-4 sm:bottom-4 sm:items-stretch sm:p-0">
                  <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} onFocusTour={focusTour} />
                </div>
              )}
            </>
          ) : (
            <Timeline onSelectTour={(id) => focusTour(id)} />
          )}
        </main>
      </div>
    </div>
  );
}
