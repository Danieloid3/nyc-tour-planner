import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet-polylinedecorator";
import { days, allPlaces, type Place } from "@/data/itinerary";
import type { Theme } from "@/hooks/use-theme";
import type { GeolocationState } from "@/hooks/use-geolocation";

interface TravelMapProps {
  theme: Theme;
  activeDayIds: Set<string>;
  selectedDayId: string | null;
  selectedPlaceId: string | null;
  showRoutes: boolean;
  searchMatchIds: Set<string> | null;
  userLocation?: GeolocationState;
  visitedIds: Set<string>;
  onMapInstance?: (map: L.Map) => void;
  onSelectPlace: (place: Place & { dayId: string }) => void;
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

function placeIcon(p: (typeof allPlaces)[number], opts: { active?: boolean; dimmed?: boolean; visited?: boolean }) {
  const cls = ["travel-marker", opts.active ? "active" : "", opts.dimmed ? "dimmed" : "", opts.visited ? "visited" : ""]
    .filter(Boolean)
    .join(" ");
  
  const content = opts.visited 
    ? `<span class="visited-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>` 
    : `<span style="font-weight:bold; font-size:16px;">${p.order}</span>`;

  const label = `<div class="marker-label">${p.name}</div>`;

  return L.divIcon({
    className: "",
    html: `<div class="${cls}" style="background:${p.dayColor}">${content}</div>${label}`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

export default function TravelMap({
  theme,
  activeDayIds,
  selectedDayId,
  selectedPlaceId,
  showRoutes,
  searchMatchIds,
  userLocation,
  visitedIds,
  onMapInstance,
  onSelectPlace,
}: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const plainLayerRef = useRef<L.LayerGroup | null>(null);
  const prevDayIdRef = useRef<string | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const userAccuracyRef = useRef<L.Circle | null>(null);
  const onSelectRef = useRef(onSelectPlace);
  onSelectRef.current = onSelectPlace;

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: MANHATTAN,
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
    });
    L.control.zoom({ position: 'bottomleft' }).addTo(map);


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
    
    // Add subway stations
    const subwayLayerRef = L.layerGroup().addTo(map);

    fetch('/subway-stations-clean.geojson')
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          pointToLayer: (feature, latlng) => {
            const line = feature.properties?.line || '';
            const name = feature.properties?.name || '';
            
            let color = '#808183';
            const l = line.split('-')[0];
            if (['A', 'C', 'E'].includes(l)) color = '#0039A6';
            else if (['B', 'D', 'F', 'M'].includes(l)) color = '#FF6319';
            else if (['G'].includes(l)) color = '#6CBE45';
            else if (['J', 'Z'].includes(l)) color = '#996633';
            else if (['L'].includes(l)) color = '#A7A9AC';
            else if (['N', 'Q', 'R', 'W'].includes(l)) color = '#FCCC0A';
            else if (['1', '2', '3'].includes(l)) color = '#EE352E';
            else if (['4', '5', '6'].includes(l)) color = '#00933C';
            else if (['7'].includes(l)) color = '#B933AD';

            const svgTrain = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" class="subway-icon-svg"><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>`;

            const marker = L.marker(latlng, {
              icon: L.divIcon({
                className: 'subway-icon-wrapper',
                html: svgTrain,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }),
              zIndexOffset: -500 // Subways stay beneath places
            }).bindTooltip(`<div style="text-align:center"><strong>${name}</strong><br/><span style="font-size:11px;color:#888">Líneas: ${line}</span></div>`, { 
              direction: 'top', 
              offset: [0, -10],
              className: 'subway-tooltip'
            });
            
            return marker;
          }
        }).addTo(subwayLayerRef);
      })
      .catch(e => console.error('Error loading subways', e));

    map.on('zoomend', () => {
      const z = map.getZoom();
      const el = containerRef.current;
      if (el) {
        if (z >= 15) el.classList.add('show-labels');
        else el.classList.remove('show-labels');
        
        el.classList.remove('map-zoom-low', 'map-zoom-mid', 'map-zoom-high');
        if (z <= 12) el.classList.add('map-zoom-low');
        else if (z <= 14) el.classList.add('map-zoom-mid');
        else el.classList.add('map-zoom-high');
      }
    });
    
    // Trigger once to set initial classes
    map.fire('zoomend');

    if (onMapInstance) onMapInstance(map);
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

  // user location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation?.lat || !userLocation?.lng) return;
    
    const latlng: L.LatLngTuple = [userLocation.lat, userLocation.lng];
    
    if (!userMarkerRef.current) {
      userAccuracyRef.current = L.circle(latlng, {
        radius: userLocation.accuracy || 20,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 1,
        interactive: false
      }).addTo(map);

      userMarkerRef.current = L.circleMarker(latlng, {
        radius: 7,
        color: 'white',
        fillColor: '#2563eb',
        fillOpacity: 1,
        weight: 2,
        zIndexOffset: 2000,
        interactive: false
      }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(latlng);
      if (userAccuracyRef.current) {
        userAccuracyRef.current.setLatLng(latlng);
        userAccuracyRef.current.setRadius(userLocation.accuracy || 20);
      }
    }
  }, [userLocation?.lat, userLocation?.lng, userLocation?.accuracy]);

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

    const focus = selectedDayId;

    // Which places are visible
    const visible = allPlaces.filter((p) => {
      if (focus) return p.dayId === focus;
      if (searchMatchIds) return true; // show all, dim non-matches
      return activeDayIds.has(p.dayId);
    });

    const addMarker = (p: (typeof allPlaces)[number], target: L.LayerGroup | L.MarkerClusterGroup) => {
      const dimmed = !!searchMatchIds && !searchMatchIds.has(p.id);
      const active = selectedPlaceId === p.id;
      const visited = visitedIds.has(p.id);
      const m = L.marker([p.lat, p.lng], { icon: placeIcon(p, { active, dimmed, visited }), zIndexOffset: active ? 1000 : 0 });
      m.on("click", () => onSelectRef.current(p));
      // No bindTooltip needed anymore since we embedded the label in the icon HTML
      target.addLayer(m as unknown as L.Layer);
    };

    if (focus) {
      // focus mode: plain markers + route for the selected day
      const day = days.find((t) => t.id === focus)!;
      const ordered = [...day.places].sort((a, b) => a.order - b.order);
      visible.forEach((p) => addMarker(p, plain));
      const latlngs = ordered.map((p) => [p.lat, p.lng]) as L.LatLngTuple[];
      const pline = L.polyline(latlngs, { color: day.color, weight: 4, opacity: 0.9, dashArray: "1 0" }).addTo(routes);
      
      // Vector arrows using polyline decorator
      L.polylineDecorator(pline, {
        patterns: [
          {
            offset: '10%',
            repeat: '100px',
            symbol: L.Symbol.arrowHead({
              pixelSize: 14,
              polygon: true,
              pathOptions: { stroke: true, weight: 2, color: day.color, fillOpacity: 1, fillColor: '#ffffff' }
            })
          }
        ]
      }).addTo(routes);

      if (latlngs.length && prevDayIdRef.current !== selectedDayId) {
        map.flyToBounds(L.latLngBounds(latlngs).pad(0.25), { duration: 0.4, maxZoom: 15 });
      }
      prevDayIdRef.current = selectedDayId || null;
    } else {
      prevDayIdRef.current = null;
      // overview: clustered markers for active days
      visible.forEach((p) => addMarker(p, cluster));
      if (showRoutes) {
        days
          .filter((t) => activeDayIds.has(t.id))
          .forEach((t) => {
            const ordered = [...t.places].sort((a, b) => a.order - b.order);
            const latlngs = ordered.map((p) => [p.lat, p.lng]) as L.LatLngTuple[];
            L.polyline(latlngs, { color: t.color, weight: 3, opacity: 0.55 }).addTo(routes);
          });
      }
    }
  }, [activeDayIds, selectedDayId, selectedPlaceId, showRoutes, searchMatchIds, visitedIds]);

  // pan to selected place removed to prevent map jump

  // reset view when deselecting day
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedDayId) return;
    const visible = allPlaces.filter((p) => activeDayIds.has(p.dayId));
    if (visible.length === 0) {
      map.flyTo(MANHATTAN, 13, { duration: 0.4 });
      return;
    }
    const b = L.latLngBounds(visible.map((p) => [p.lat, p.lng] as L.LatLngTuple));
    map.flyToBounds(b.pad(0.15), { duration: 0.4, maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
