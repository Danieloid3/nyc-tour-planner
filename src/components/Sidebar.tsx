import { Eye, EyeOff, Route, RotateCcw } from "lucide-react";
import { days, CATEGORY_LABELS, type Category } from "@/data/itinerary";
import { CATEGORY_META } from "@/lib/categories";
import { StatsBar } from "./StatsBar";

interface Props {
  activeCategories: Set<string>;
  onToggleCategory: (cat: string) => void;
  activeDayIds: Set<string>;
  onToggleDay: (id: string) => void;
  selectedDayId: string | null;
  onFocusDay: (id: string | null) => void;
  showRoutes: boolean;
  onToggleRoutes: () => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export function Sidebar({
  activeCategories,
  onToggleCategory,
  activeDayIds,
  onToggleDay,
  selectedDayId,
  onFocusDay,
  showRoutes,
  onToggleRoutes,
  onShowAll,
  onHideAll,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="space-y-3">
        <div className="flex w-full gap-2 overflow-x-auto pb-2 snap-x thin-scroll">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => {
            const active = activeCategories.has(cat);
            const meta = CATEGORY_META[cat];
            const Icon = meta?.icon;
            if (!Icon) return null;
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className={`snap-center shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                  active 
                    ? "border-primary bg-primary/10 text-primary shadow-sm" 
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
        <StatsBar selectedDayId={selectedDayId} />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleRoutes}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
            showRoutes
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <Route className="h-3.5 w-3.5" /> Rutas
        </button>
        <button
          onClick={onShowAll}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <Eye className="h-3.5 w-3.5" /> Todos
        </button>
        <button
          onClick={onHideAll}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <EyeOff className="h-3.5 w-3.5" /> Ninguno
        </button>
      </div>

      {selectedDayId && (
        <button
          onClick={() => onFocusDay(null)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground transition hover:bg-secondary/70"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Ver todos los días
        </button>
      )}

      <div className="thin-scroll -mr-2 flex-1 space-y-2 overflow-y-auto pr-2">
        {days.map((t) => {
          const active = activeDayIds.has(t.id);
          const focused = selectedDayId === t.id;
          return (
            <div
              key={t.id}
              className={`group rounded-xl border p-3 transition ${
                focused ? "border-transparent ring-2" : "border-border hover:border-primary/40"
              }`}
              style={focused ? { ["--tw-ring-color" as string]: t.color, background: `${t.color}12` } : undefined}
            >
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => onToggleDay(t.id)}
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition"
                  style={{
                    borderColor: t.color,
                    background: active ? t.color : "transparent",
                  }}
                  aria-label={`Activar ${t.title}`}
                >
                  {active && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
                      <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <button onClick={() => onFocusDay(focused ? null : t.id)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: t.color }}>
                      Día {t.number}
                    </span>
                    <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {t.places.length} lugares
                    </span>
                  </div>
                  <div className="truncate text-sm font-semibold text-foreground">{t.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.subtitle}</div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
