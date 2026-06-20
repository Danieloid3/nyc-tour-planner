import { useState, useEffect, useRef } from 'react';
import {
  Heart, ArrowRight, CheckCircle2, MapPin, Navigation,
  GripVertical, ChevronDown, Map as MapIcon, Clock,
} from 'lucide-react';

/* ─── Palette (matches app theme) ─── */
const DAY_COLORS = ['#c17c74', '#7c9c74', '#7474c1', '#c1a474', '#74a4c1'];

/* ─── Mini-UI building blocks ─── */

/** Animated place card row for slide 2 */
function PlaceRow({
  num, name, sub, delay, color, checked, onCheck,
}: {
  num: number; name: string; sub: string; delay: number;
  color: string; checked: boolean; onCheck: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl bg-card px-3 py-2.5 shadow-sm border border-border/60 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {/* Tap-to-check circle */}
      <button
        onClick={onCheck}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 active:scale-90 ${
          checked
            ? 'border-transparent bg-emerald-500 text-white scale-110'
            : 'border-border bg-background'
        }`}
        aria-label="marcar visitado"
      >
        {checked && <CheckCircle2 className="h-4 w-4" />}
      </button>

      {/* Color band + number */}
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white shadow"
        style={{ background: color }}
      >
        {num}
      </span>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-bold leading-tight transition-colors duration-300 ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {name}
        </p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

/** Animated map for slide 3 */
function MiniMap({ color }: { color: string }) {
  const [pulse, setPulse] = useState(false);
  const [markerPop, setMarkerPop] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMarkerPop(true), 400);
    const t2 = setTimeout(() => setPulse(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Fake mini map markers
  const markers = [
    { x: 38, y: 42, label: 'Empire State', active: true },
    { x: 65, y: 28, label: 'MOMA', active: false },
    { x: 22, y: 65, label: 'Times Sq.', active: false },
    { x: 72, y: 60, label: 'Bryant Park', active: false },
  ];

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-border/60 shadow-inner bg-[#e8e0d4]">
      {/* Fake grid streets */}
      {[20, 35, 50, 65, 80].map(y => (
        <div key={y} className="absolute left-0 right-0 border-t border-[#d5c8b8]" style={{ top: `${y}%` }} />
      ))}
      {[15, 30, 50, 70, 85].map(x => (
        <div key={x} className="absolute top-0 bottom-0 border-l border-[#d5c8b8]" style={{ left: `${x}%` }} />
      ))}

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points="38,42 65,28 22,65 72,60"
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeDasharray="3 2"
          opacity="0.7"
          className="transition-all duration-1000"
        />
      </svg>

      {/* Markers */}
      {markers.map((m, i) => (
        <div
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
            markerPop ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{ left: `${m.x}%`, top: `${m.y}%`, transitionDelay: `${i * 100}ms` }}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-md text-white text-[10px] font-black ${
              m.active ? 'ring-2 ring-white/70 scale-125' : ''
            }`}
            style={{ background: color }}
          >
            {i + 1}
          </div>
          {m.active && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-0.5 text-[9px] font-bold shadow border border-border/50">
              {m.label}
            </div>
          )}
        </div>
      ))}

      {/* Blue dot — user location */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '72%' }}
      >
        {pulse && (
          <span className="absolute inset-0 -m-2 rounded-full bg-blue-400/30 animate-ping" />
        )}
        <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
      </div>

      {/* Label */}
      <div className="absolute bottom-2 right-2 rounded-lg bg-card/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-foreground border border-border/50 shadow flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        Tú estás aquí
      </div>
    </div>
  );
}

/** Animated drawer demo for slide 4 */
function DrawerDemo({ color }: { color: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-border/60 shadow-inner bg-[#e8e0d4]">
      {/* Map background */}
      {[20, 40, 60, 80].map(y => (
        <div key={y} className="absolute left-0 right-0 border-t border-[#d5c8b8]" style={{ top: `${y}%` }} />
      ))}
      {[25, 50, 75].map(x => (
        <div key={x} className="absolute top-0 bottom-0 border-l border-[#d5c8b8]" style={{ left: `${x}%` }} />
      ))}

      {/* Tapped marker */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-xl text-white text-sm font-black scale-125"
          style={{ background: color }}
        >
          3
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-0.5 text-[9px] font-bold shadow border border-border/50">
          Rockefeller Center
        </div>
      </div>

      {/* Bottom drawer sliding up */}
      <div
        className={`absolute left-0 right-0 bottom-0 rounded-t-2xl bg-card border-t border-border shadow-2xl transition-transform duration-500 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
        <div className="px-4 py-3">
          <p className="text-xs font-black text-foreground">Rockefeller Center</p>
          <p className="text-[10px] text-muted-foreground mb-2">Mirador · Midtown</p>
          <div
            className="flex items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-black text-white shadow"
            style={{ background: color }}
          >
            <Navigation className="h-3 w-3" />
            Llévame hasta aquí
          </div>
        </div>
      </div>
    </div>
  );
}

/** Animated drag-reorder demo for slide 5 */
function DragDemo({ color }: { color: string }) {
  const items = [
    { num: 1, name: 'Central Park', sub: 'Parque' },
    { num: 2, name: 'The Met', sub: 'Museo' },
    { num: 3, name: 'Guggenheim', sub: 'Museo' },
  ];

  const [dragging, setDragging] = useState(false);
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDragging(true), 500);
    const t2 = setTimeout(() => { setSwapped(true); setDragging(false); }, 1400);
    const t3 = setTimeout(() => { setSwapped(false); }, 2600);
    const t4 = setTimeout(() => setDragging(true), 3200);
    const t5 = setTimeout(() => { setSwapped(true); setDragging(false); }, 4100);
    const t6 = setTimeout(() => setSwapped(false), 5300);
    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, []);

  const order = swapped ? [items[0], items[2], items[1]] : items;

  return (
    <div className="flex flex-col gap-2 w-full">
      {order.map((item, i) => {
        const isLifted = dragging && i === (swapped ? 2 : 1);
        return (
          <div
            key={item.name}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all duration-300 ${
              isLifted
                ? 'bg-card shadow-xl border-border scale-105 -rotate-1 z-10'
                : 'bg-card shadow-sm border-border/60'
            }`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
              style={{ background: color }}
            >
              {item.num}
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">{item.name}</p>
              <p className="text-[10px] text-muted-foreground">{item.sub}</p>
            </div>
            {isLifted && (
              <span className="ml-auto text-[10px] font-bold text-muted-foreground animate-pulse">
                arrastrando…
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Slide definitions ─── */
type Slide = {
  key: string;
  color: string;
  title: string;
  subtitle: string;
  visual: React.ReactNode;
  hint?: string;
};

function buildSlides(): Slide[] {
  const c = DAY_COLORS;
  return [
    {
      key: 'welcome',
      color: c[0],
      title: '¡Bienvenidos a Nueva York!',
      subtitle: 'Les preparé esta guía con todo mi amor para que su viaje sea tranquilo e inolvidable.',
      visual: (
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: c[0] }} />
            <span className="absolute inset-2 rounded-full opacity-10" style={{ background: c[0] }} />
            <Heart className="h-14 w-14 animate-pulse" style={{ color: c[0] }} />
          </div>
        </div>
      ),
    },
    {
      key: 'list',
      color: c[1],
      title: 'El plan de cada día',
      subtitle: 'Toquen un día para ver todos los lugares. Toquen el círculo para marcarlo como visitado ✓',
      hint: 'Pruébenlo — toquen los círculos',
      visual: <PlaceListDemo color={c[1]} />,
    },
    {
      key: 'map',
      color: c[2],
      title: 'El mapa interactivo',
      subtitle: 'El punto azul son ustedes. Los números son los lugares del día. Toquen "VER RUTA" para verlo en el mapa.',
      visual: <MiniMap color={c[2]} />,
    },
    {
      key: 'nav',
      color: c[3],
      title: '¿Cómo llegar?',
      subtitle: 'Toquen cualquier lugar en el mapa o la lista y aparecerá su ficha. Pulsen "Llévame hasta aquí" para las indicaciones.',
      visual: <DrawerDemo color={c[3]} />,
    },
    {
      key: 'drag',
      color: c[4],
      title: 'A su propio ritmo',
      subtitle: 'Si quieren cambiar el orden del día, mantengan presionado un lugar y arrástrenlo a donde quieran.',
      visual: <DragDemo color={c[4]} />,
    },
  ];
}

/** Separate component so it can use hooks with proper key reset */
function PlaceListDemo({ color }: { color: string }) {
  const places = [
    { name: 'Grand Central Terminal', sub: 'Estación · 1.2 km' },
    { name: 'The High Line', sub: 'Parque · 2.8 km' },
    { name: 'Chelsea Market', sub: 'Compras · 0.3 km' },
  ];
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  const toggle = (i: number) =>
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="flex flex-col gap-2 w-full">
      {places.map((p, i) => (
        <PlaceRow
          key={p.name}
          num={i + 1}
          name={p.name}
          sub={p.sub}
          delay={i * 150}
          color={color}
          checked={checked[i]}
          onCheck={() => toggle(i)}
        />
      ))}
      {checked.every(Boolean) && (
        <div className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-2 text-sm font-bold text-emerald-600 animate-fade-in-up border border-emerald-500/20">
          <CheckCircle2 className="h-4 w-4" /> ¡Día completado!
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─── */
export default function Onboarding({
  forceShow,
  onComplete,
}: {
  forceShow?: boolean;
  onComplete?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [current, setCurrent] = useState(0);
  const slidesRef = useRef(buildSlides());
  const slides = slidesRef.current;
  const total = slides.length;

  useEffect(() => {
    if (forceShow) {
      setIsClosing(false);
      setIsVisible(true);
      setCurrent(0);
      return;
    }
    const seen = localStorage.getItem('nyc-onboarding-seen-v6');
    if (!seen) setTimeout(() => setIsVisible(true), 400);
  }, [forceShow]);

  if (!isVisible) return null;

  const slide = slides[current];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('nyc-onboarding-seen-v6', 'true');
      setIsVisible(false);
      onComplete?.();
    }, 350);
  };

  const next = () => {
    if (current < total - 1) setCurrent(c => c + 1);
    else handleClose();
  };

  const prev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-end sm:items-center justify-center transition-opacity duration-350 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] bg-card border border-border shadow-2xl overflow-hidden transition-all duration-350 ${
          isClosing ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100 animate-fade-in-up'
        }`}
      >
        {/* Color accent bar top */}
        <div
          className="h-1.5 w-full transition-all duration-500"
          style={{ background: slide.color }}
        />

        {/* Skip button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          Saltar
        </button>

        {/* Content */}
        <div className="px-6 pt-10 pb-4">
          {/* Slide visual — keyed to re-mount on slide change */}
          <div
            key={slide.key}
            className="animate-fade-in-up mb-5"
          >
            {slide.visual}
          </div>

          {/* Text */}
          <div key={`text-${slide.key}`} className="animate-fade-in-up text-center">
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2"
              style={{ color: slide.color }}
            >
              {slide.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              {slide.subtitle}
            </p>
            {slide.hint && (
              <p className="mt-2 text-sm font-bold text-foreground/50 animate-pulse">
                {slide.hint}
              </p>
            )}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-7 h-2.5'
                  : 'w-2.5 h-2.5 bg-border hover:bg-muted-foreground/40'
              }`}
              style={i === current ? { background: slide.color } : {}}
              aria-label={`Ir a paso ${i + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          {current > 0 && (
            <button
              onClick={prev}
              className="flex h-14 w-1/3 items-center justify-center rounded-2xl bg-secondary text-foreground font-bold shadow-sm transition hover:bg-secondary/70 active:scale-95 text-base"
            >
              Atrás
            </button>
          )}
          <button
            onClick={next}
            className={`flex h-14 items-center justify-center gap-2 rounded-2xl font-black text-white shadow-lg transition hover:opacity-90 active:scale-95 text-base ${
              current > 0 ? 'flex-1' : 'w-full'
            }`}
            style={{ background: slide.color }}
          >
            {current === total - 1 ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                ¡Empezar el viaje!
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
