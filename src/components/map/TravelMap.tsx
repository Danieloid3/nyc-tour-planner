import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet-polylinedecorator";
import { allPlaces, type Place, type DayPlan } from "@/data/itinerary";
import type { Theme } from "@/hooks/use-theme";
import type { GeolocationState } from "@/hooks/use-geolocation";

// Module-level cache for subway GeoJSON — fetched once for the entire app lifetime
let subwayGeoJsonCache: any = null;
let subwayFetchPromise: Promise<any> | null = null;

function getSubwayGeoJson(): Promise<any> {
  if (subwayGeoJsonCache) return Promise.resolve(subwayGeoJsonCache);
  if (subwayFetchPromise) return subwayFetchPromise;
  subwayFetchPromise = fetch('/subway-stations-clean.geojson')
    .then(res => res.json())
    .then(data => { subwayGeoJsonCache = data; return data; })
    .catch(e => { subwayFetchPromise = null; throw e; });
  return subwayFetchPromise;
}

interface TravelMapProps {
  theme: Theme;
  days: DayPlan[];
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
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

export default function TravelMap({
  theme,
  days,
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
  // Include dayTitle so the type satisfies addMarker's expected shape
  const currentPlaces = React.useMemo(
    () => days.flatMap((d) => d.places.map((p) => ({ ...p, dayId: d.id, dayTitle: d.title, dayColor: d.color }))),
    [days]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const plainLayerRef = useRef<L.LayerGroup | null>(null);
  const prevDayIdRef = useRef<string | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const userAccuracyRef = useRef<L.Circle | null>(null);
  const subwayPolylineRef = useRef<L.Polyline | null>(null);
  const subwayCloseControlRef = useRef<L.Control | null>(null);
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
    
    // Add subway stations (from module-level cache)
    const subwayLayerRef = L.layerGroup();
    const allSubwayMarkers: L.Marker[] = [];

    const clearSubwayLine = () => {
      if (subwayPolylineRef.current) {
        map.removeLayer(subwayPolylineRef.current);
        subwayPolylineRef.current = null;
      }
      if (subwayCloseControlRef.current) {
        map.removeControl(subwayCloseControlRef.current);
        subwayCloseControlRef.current = null;
      }
    };

    const CloseRouteControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        const btn = L.DomUtil.create('button', 'custom-close-subway-btn');
        btn.innerHTML = '✕ Cerrar ruta de metro';
        btn.style.backgroundColor = 'var(--card, #fff)';
        btn.style.color = 'var(--foreground, #000)';
        btn.style.padding = '8px 12px';
        btn.style.fontSize = '13px';
        btn.style.fontWeight = '700';
        btn.style.borderRadius = '20px';
        btn.style.border = '2px solid var(--border, #e5e7eb)';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
        btn.style.marginTop = '80px';
        btn.style.marginRight = '12px';
        
        L.DomEvent.on(btn, 'click', function (e) {
          L.DomEvent.stopPropagation(e);
          clearSubwayLine();
        });
        // Prevent map clicks when clicking the button
        L.DomEvent.disableClickPropagation(btn);
        
        return btn;
      }
    });

    const updateSubwayVisibility = () => {
      const m = mapRef.current;
      if (!m) return;
      const z = m.getZoom();
      
      if (z < 15) {
        if (m.hasLayer(subwayLayerRef)) m.removeLayer(subwayLayerRef);
        return;
      }
      
      if (!m.hasLayer(subwayLayerRef)) m.addLayer(subwayLayerRef);

      const bounds = m.getBounds().pad(0.2); // 20% margin
      allSubwayMarkers.forEach(marker => {
        if (bounds.contains(marker.getLatLng())) {
          if (!subwayLayerRef.hasLayer(marker)) subwayLayerRef.addLayer(marker);
        } else {
          if (subwayLayerRef.hasLayer(marker)) subwayLayerRef.removeLayer(marker);
        }
      });
    };

    getSubwayGeoJson()
      .then(data => {
        L.geoJSON(data, {
          pointToLayer: (feature, latlng) => {
            const { name, line } = feature.properties;
            
            const getMtaColor = (l: string) => {
              const lineId = l.replace(/ Express/i, '').trim();
              if (['A', 'C', 'E'].includes(lineId)) return { bg: '#0039A6', text: '#FFFFFF' };
              if (['B', 'D', 'F', 'M'].includes(lineId)) return { bg: '#FF6319', text: '#FFFFFF' };
              if (['G'].includes(lineId)) return { bg: '#6CBE45', text: '#FFFFFF' };
              if (['J', 'Z'].includes(lineId)) return { bg: '#996633', text: '#FFFFFF' };
              if (['L', 'S'].includes(lineId)) return { bg: '#A7A9AC', text: '#FFFFFF' };
              if (['N', 'Q', 'R', 'W'].includes(lineId)) return { bg: '#FCCC0A', text: '#000000' };
              if (['1', '2', '3'].includes(lineId)) return { bg: '#EE352E', text: '#FFFFFF' };
              if (['4', '5', '6'].includes(lineId)) return { bg: '#00933C', text: '#FFFFFF' };
              if (['7'].includes(lineId)) return { bg: '#B933AD', text: '#FFFFFF' };
              return { bg: '#808183', text: '#FFFFFF' };
            };

            const primaryLine = line.split('-')[0].replace(/ Express/i, '').trim();
            const { bg: primaryColor, text: primaryTextColor } = getMtaColor(primaryLine);

            const svgTrain = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="subway-icon-svg bg-background rounded shadow-sm"><rect width="16" height="16" x="4" y="3" rx="2"></rect><path d="M4 11h16"></path><path d="M12 3v8"></path><path d="m8 19-2 3"></path><path d="m18 22-2-3"></path><path d="M8 15h.01"></path><path d="M16 15h.01"></path></svg>`;

            const linesHtml = line.split('-').map((l: string) => {
              const rawL = l.trim();
              const cleanL = rawL.replace(/ Express/i, '').trim();
              const { bg, text } = getMtaColor(cleanL);
              const displayTxt = rawL.toLowerCase().includes('express') ? cleanL + 'X' : cleanL;
              
              return `<span style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; min-width:24px; border-radius:50%; background-color:${bg}; color:${text}; font-size:${displayTxt.length > 1 ? '11px' : '13px'}; font-weight:bold; margin-right:4px; box-shadow: 0 1px 2px rgba(0,0,0,0.15); line-height:1;">${displayTxt}</span>`;
            }).join('');

            const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latlng.lat},${latlng.lng}`;

            const popupHtml = `
              <div style="padding: 16px 18px; min-width: 180px; max-width: 280px; box-sizing: border-box;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: var(--foreground); border-bottom: 1px solid var(--border); padding-bottom: 12px; line-height: 1.3; word-wrap: break-word; white-space: normal; display: flex; align-items: center; gap: 8px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.6; flex-shrink: 0;"><rect width="16" height="16" x="4" y="3" rx="2"></rect><path d="M4 11h16"></path><path d="M12 3v8"></path><path d="m8 19-2 3"></path><path d="m18 22-2-3"></path><path d="M8 15h.01"></path><path d="M16 15h.01"></path></svg>
                  <span style="flex: 1;">${name}</span>
                </h3>
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px;">
                  ${linesHtml}
                </div>
                <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center gap-2 w-full py-2.5 px-3 hover:opacity-90 active:scale-95 transition-all rounded-xl text-[14px] font-bold shadow-md" style="text-decoration:none; background-color:${primaryColor}; color:${primaryTextColor};">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Llevarme hasta aquí
                </a>
              </div>
            `;

            const marker = L.marker(latlng, {
              icon: L.divIcon({
                className: 'subway-icon-wrapper',
                html: svgTrain,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
              }),
              zIndexOffset: -500 // Subways stay beneath places
            }).bindPopup(popupHtml, {
              className: 'custom-subway-popup rounded-2xl overflow-hidden'
            });
            
            (marker as any).feature = feature;
            
            marker.on('click', () => {
              clearSubwayLine();
              
              // We'll match against the specific primary line (e.g. '1', 'A')
              const sameLineMarkers = allSubwayMarkers.filter(m => {
                const f = (m as any).feature;
                if (!f) return false;
                // Properties line might look like '1-2' or 'A-C-E'. We split and check if it includes our primary line
                const lines = f.properties.line.split('-').map((l: string) => l.replace(/ Express/i, '').trim());
                return lines.includes(primaryLine);
              });
              
              if (sameLineMarkers.length > 1) {
                let unvisited = [...sameLineMarkers];
                unvisited.sort((a,b) => b.getLatLng().lat - a.getLatLng().lat);
                
                const sorted = [unvisited.shift() as L.Marker];
                
                while (unvisited.length > 0) {
                  const last = sorted[sorted.length - 1].getLatLng();
                  let closestIdx = 0;
                  let minDist = Infinity;
                  for (let i = 0; i < unvisited.length; i++) {
                    const dist = last.distanceTo(unvisited[i].getLatLng());
                    if (dist < minDist) {
                      minDist = dist;
                      closestIdx = i;
                    }
                  }
                  sorted.push(unvisited[closestIdx]);
                  unvisited.splice(closestIdx, 1);
                }
                
                const latlngs = sorted.map(m => m.getLatLng());
                subwayPolylineRef.current = L.polyline(latlngs, {
                  color: primaryColor,
                  weight: 5,
                  opacity: 0.8,
                  dashArray: '1, 10',
                  lineCap: 'round'
                }).addTo(map);

                subwayCloseControlRef.current = new CloseRouteControl();
                map.addControl(subwayCloseControlRef.current);
              }
            });
            
            allSubwayMarkers.push(marker);
            return marker;
          }
        });
        updateSubwayVisibility();
      })
      .catch(e => console.error('Error loading subways', e));

    map.on('moveend', updateSubwayVisibility);

    map.on('zoomend', () => {
      const z = map.getZoom();
      const el = containerRef.current;
      if (el) {
        if (z >= 15) el.classList.add('show-labels');
        else el.classList.remove('show-labels');
        
        el.classList.remove('map-zoom-low', 'map-zoom-mid', 'map-zoom-high');
        if (z <= 14) el.classList.add('map-zoom-low');
        else if (z === 15) el.classList.add('map-zoom-mid');
        else el.classList.add('map-zoom-high');
      }
      updateSubwayVisibility();
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
    if (!tileRef.current) return;
    tileRef.current.setUrl(TILE[theme]);
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
        interactive: false,
        // Note: zIndexOffset is a Marker option, not valid on CircleMarker
      }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(latlng);
      if (userAccuracyRef.current) {
        userAccuracyRef.current.setLatLng(latlng);
        userAccuracyRef.current.setRadius(userLocation.accuracy || 20);
      }
    }
  }, [userLocation?.lat, userLocation?.lng, userLocation?.accuracy]);

  // Stable marker creator
  const createMarker = useCallback((p: (typeof allPlaces)[number], opts: { dimmed: boolean; active: boolean; visited: boolean }) => {
    const m = L.marker([p.lat, p.lng], { icon: placeIcon(p, opts), zIndexOffset: opts.active ? 1000 : 0 });
    m.on("click", () => onSelectRef.current(p));
    return m;
  }, []);

  // Effect 1: Render markers — runs when days, active filters, selected place, or visited state changes
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    const plain = plainLayerRef.current;
    if (!map || !cluster || !plain) return;

    cluster.clearLayers();
    plain.clearLayers();

    const focus = selectedDayId;
    const visible = currentPlaces.filter((p) => {
      if (focus) return p.dayId === focus;
      if (searchMatchIds) return true;
      return activeDayIds.has(p.dayId);
    });

    if (focus) {
      const markers = visible.map((p) => createMarker(p, {
        dimmed: false,
        active: selectedPlaceId === p.id,
        visited: visitedIds.has(p.id),
      }));
      markers.forEach(m => plain.addLayer(m));
    } else {
      const markers = visible.map((p) => createMarker(p, {
        dimmed: !!searchMatchIds && !searchMatchIds.has(p.id),
        active: selectedPlaceId === p.id,
        visited: visitedIds.has(p.id),
      }));
      cluster.addLayers(markers);
    }
  }, [activeDayIds, selectedDayId, selectedPlaceId, searchMatchIds, visitedIds, days, currentPlaces, createMarker]);

  // Effect 2: Render routes + arrows — does NOT depend on visitedIds, avoids recreating decorators on check-off
  useEffect(() => {
    const map = mapRef.current;
    const routes = routeLayerRef.current;
    if (!map || !routes) return;

    routes.clearLayers();
    const focus = selectedDayId;

    if (focus) {
      const day = days.find((t) => t.id === focus);
      if (!day) return;
      const ordered = [...day.places].sort((a, b) => a.order - b.order);
      const latlngs = ordered.map((p) => [p.lat, p.lng]) as L.LatLngTuple[];
      const pline = L.polyline(latlngs, { color: day.color, weight: 4, opacity: 0.9, dashArray: "1 0" }).addTo(routes);
      L.polylineDecorator(pline, {
        patterns: [{
          offset: '10%',
          repeat: '100px',
          symbol: L.Symbol.arrowHead({
            pixelSize: 14,
            polygon: true,
            pathOptions: { stroke: true, weight: 2, color: day.color, fillOpacity: 1, fillColor: '#ffffff' }
          })
        }]
      }).addTo(routes);
      if (latlngs.length && prevDayIdRef.current !== selectedDayId) {
        map.flyToBounds(L.latLngBounds(latlngs).pad(0.25), { duration: 0.4, maxZoom: 15 });
      }
      prevDayIdRef.current = selectedDayId || null;
    } else {
      prevDayIdRef.current = null;
      if (showRoutes) {
        days.filter((t) => activeDayIds.has(t.id)).forEach((t) => {
          const ordered = [...t.places].sort((a, b) => a.order - b.order);
          const latlngs = ordered.map((p) => [p.lat, p.lng]) as L.LatLngTuple[];
          L.polyline(latlngs, { color: t.color, weight: 3, opacity: 0.55 }).addTo(routes);
        });
      }
    }
  }, [activeDayIds, selectedDayId, showRoutes, days]);

  // pan to selected place removed to prevent map jump

  // reset view when deselecting day
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedDayId) return;
    const visible = currentPlaces.filter((p) => activeDayIds.has(p.dayId));
    if (visible.length === 0) {
      map.flyTo(MANHATTAN, 13, { duration: 0.4 });
      return;
    }
    const b = L.latLngBounds(visible.map((p) => [p.lat, p.lng] as L.LatLngTuple));
    map.flyToBounds(b.pad(0.15), { duration: 0.4, maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayId, currentPlaces]);

  return <div ref={containerRef} className="h-full w-full" />;
}
