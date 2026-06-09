import { useEffect, useState, type ComponentType } from "react";
import type { Place } from "@/data/itinerary";
import type { Theme } from "@/hooks/use-theme";

interface Props {
  theme: Theme;
  activeTourIds: Set<string>;
  selectedTourId: string | null;
  selectedPlaceId: string | null;
  showRoutes: boolean;
  searchMatchIds: Set<string> | null;
  onSelectPlace: (place: Place & { tourId: string }) => void;
}

export default function MapView(props: Props) {
  const [Comp, setComp] = useState<ComponentType<Props> | null>(null);

  useEffect(() => {
    let mounted = true;
    import("./TravelMap").then((m) => {
      if (mounted) setComp(() => m.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Comp) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Cargando mapa…</span>
        </div>
      </div>
    );
  }

  return <Comp {...props} />;
}
