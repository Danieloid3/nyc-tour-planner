import { MapPin, Route, Landmark, Trees, Mountain, ShoppingBag } from "lucide-react";
import { allPlaces, tours } from "@/data/itinerary";

const stats = [
  { icon: MapPin, label: "Lugares", value: allPlaces.length },
  { icon: Route, label: "Tours", value: tours.length },
  { icon: Landmark, label: "Museos", value: allPlaces.filter((p) => p.category === "museo").length },
  { icon: Trees, label: "Parques", value: allPlaces.filter((p) => p.category === "parque").length },
  { icon: Mountain, label: "Miradores", value: allPlaces.filter((p) => p.category === "mirador").length },
  { icon: ShoppingBag, label: "Compras", value: allPlaces.filter((p) => p.category === "compras").length },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-2.5 text-center">
          <s.icon className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-base font-bold leading-none text-foreground">{s.value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
