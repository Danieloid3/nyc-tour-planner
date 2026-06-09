import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { tours, allPlaces, type Place } from "@/data/itinerary";
import { CATEGORY_META } from "@/lib/categories";
import type { Theme } from "@/hooks/use-theme";

interface TravelMapProps {
  theme: Theme;
  activeTourIds: Set<string>;
  selectedTourId: string | null;
  selectedPlaceId: string | null;
  showRoutes: boolean;
  searchMatchIds: Set<string> | null;
  onSelectPlace: (place: Place & { tourId: string }) => void;
}

const TILE = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

const MANHATTAN: L.LatLngTuple = [40.7549, -73.984];

function bearing(a: Place, b: Place): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function placeIcon(p: (typeof allPlaces)[number], opts: { active?: boolean; dimmed?: boolean }) {
  const meta = CATEGORY_META[p.category];
  const cls = ["travel-marker", opts.active ? "active" : "", opts.dimmed ? "dimmed" : ""]
    .filter(Boolean)
    .join(" ");
  return L.divIcon({
    className: "",
    html: `<div class="${cls}" style="background:${p.tourColor}"><span>${meta.emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

export default function TravelMap({
  theme,
  activeTourIds,
  selectedTourId,
  selectedPlaceId,
  showRoutes,
  searchMatchIds,
  onSelectPlace,
}: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const plainLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectPlace);
  onSelectRef.current = onSelectPlace;

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: MANHATTAN,
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;
    tileRef.current = L.tileLayer(TILE[theme], {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
    }).addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    plainLayerRef.current = L.layerGroup().addTo(map);
    clusterRef.current = L.markerClusterGroup({
      maxClusterRadius: 45,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 38 : count < 25 ? 46 : 54;
        return L.divIcon({
          html: `<div class="cluster-marker" style="width:${size}px;height:${size}px;background:var(--primary)">${count}</div>`,
          className: "",
          iconSize: [size, size],
        });
      },
    });
    map.addLayer(clusterRef.current);
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // theme tiles
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileRef.current) return;
    map.removeLayer(tileRef.current);
    tileRef.current = L.tileLayer(TILE[theme], {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
    }).addTo(map);
    tileRef.current.bringToBack();
  }, [theme]);

  // render markers + routes whenever state changes
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    const plain = plainLayerRef.current;
    const routes = routeLayerRef.current;
    if (!map || !cluster || !plain || !routes) return;

    cluster.clearLayers();
    plain.clearLayers();
    routes.clearLayers();

    const focus = selectedTourId;

    // Which places are visible
    const visible = allPlaces.filter((p) => {
      if (focus) return p.tourId === focus;
      return activeTourIds.has(p.tourId);
    });

    const addMarker = (p: (typeof allPlaces)[number], target: L.LayerGroup | L.MarkerClusterGroup) => {
      const dimmed = !!searchMatchIds && !searchMatchIds.has(p.id);
      const active = selectedPlaceId === p.id;
      const m = L.marker([p.lat, p.lng], { icon: placeIcon(p, { active, dimmed }), zIndexOffset: active ? 1000 : 0 });
      m.on("click", () => onSelectRef.current(p));
      m.bindTooltip(`${p.order}. ${p.name}`, { direction: "top", offset: [0, -32] });
      target.addLayer(m as unknown as L.Layer);
    };

    if (focus) {
      // focus mode: plain markers + route for the selected tour
      const tour = tours.find((t) => t.id === focus)!;
      const ordered = [...tour.places].sort((a, b) => a.order - b.order);
      visible.forEach((p) => addMarker(p, plain));
      const latlngs = ordered.map((p) => [p.lat, p.lng]) as L.LatLngTuple[];
      L.polyline(latlngs, { color: tour.color, weight: 4, opacity: 0.9, dashArray: "1 0" }).addTo(routes);
      // arrows at midpoints
      for (let i = 0; i < ordered.length - 1; i++) {
        const a = ordered[i];
        const b = ordered[i + 1];
        const mid: L.LatLngTuple = [(a.lat + b.lat) / 2, (a.lng + b.lng) / 2];
        const ang = bearing(a, b) - 90;
        L.marker(mid, {
          interactive: false,
          icon: L.divIcon({
            className: "",
            html: `<div style="color:${tour.color};font-size:18px;transform:rotate(${ang}deg);text-shadow:0 0 3px rgba(0,0,0,.4)">➤</div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          }),
        }).addTo(routes);
      }
      if (latlngs.length) {
        map.flyToBounds(L.latLngBounds(latlngs).pad(0.25), { duration: 0.6, maxZoom: 15 });
      }
    } else {
      // overview: clustered markers for active tours
      visible.forEach((p) => addMarker(p, cluster));
      if (showRoutes) {
        tours
          .filter((t) => activeTourIds.has(t.id))
          .forEach((t) => {
            const ordered = [...t.places].sort((a, b) => a.order - b.order);
            const latlngs = ordered.map((p) => [p.lat, p.lng]) as L.LatLngTuple[];
            L.polyline(latlngs, { color: t.color, weight: 3, opacity: 0.55 }).addTo(routes);
          });
      }
    }
  }, [activeTourIds, selectedTourId, selectedPlaceId, showRoutes, searchMatchIds]);

  // pan to selected place
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlaceId) return;
    const p = allPlaces.find((x) => x.id === selectedPlaceId);
    if (p) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [selectedPlaceId]);

  // reset view when deselecting tour
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedTourId) return;
    const visible = allPlaces.filter((p) => activeTourIds.has(p.tourId));
    if (visible.length === 0) {
      map.flyTo(MANHATTAN, 13, { duration: 0.5 });
      return;
    }
    const b = L.latLngBounds(visible.map((p) => [p.lat, p.lng] as L.LatLngTuple));
    map.flyToBounds(b.pad(0.15), { duration: 0.5, maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTourId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
