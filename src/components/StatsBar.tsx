import { MapPin, Route, Landmark, Trees, Mountain, ShoppingBag, Clock, Footprints, Hourglass } from "lucide-react";
import { allPlaces, days } from "@/data/itinerary";
import { dayTotalDistance, formatDistance, walkingTime } from "@/lib/geo";

interface Props {
  selectedDayId?: string | null;
}

export function StatsBar({ selectedDayId }: Props) {
  if (selectedDayId) {
    const day = days.find((d) => d.id === selectedDayId);
    if (!day) return null;
    
    const places = [...day.places].sort((a, b) => a.order - b.order);
    const dist = dayTotalDistance(places);
    // Estimated time: walking time + ~60 mins per place average
    const walkingMinutes = Math.round(dist / 80); // 80m per min
    const estimatedMinutes = walkingMinutes + places.length * 60;
    
    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      if (h === 0) return `${m} min`;
      return `${h}h ${m}m`;
    };

    const dayStats = [
      { icon: MapPin, label: "Lugares", value: places.length },
      { icon: Footprints, label: "Distancia", value: formatDistance(dist) },
      { icon: Clock, label: "A pie", value: walkingTime(dist) },
      { icon: Hourglass, label: "Estimado", value: formatTime(estimatedMinutes) },
    ];

    return (
      <div className="grid grid-cols-2 gap-2">
        {dayStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-primary/30 bg-primary/5 p-2.5 text-center">
            <s.icon className="mx-auto mb-1 h-4 w-4 text-primary" />
            <div className="text-[13px] font-bold leading-none text-foreground">{s.value}</div>
            <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-primary/80">{s.label}</div>
          </div>
        ))}
      </div>
    );
  }

  const globalStats = [
    { icon: MapPin, label: "Lugares", value: allPlaces.length },
    { icon: Route, label: "Días", value: days.length },
    { icon: Landmark, label: "Museos", value: allPlaces.filter((p) => p.category === "museo").length },
    { icon: Trees, label: "Parques", value: allPlaces.filter((p) => p.category === "parque").length },
    { icon: Mountain, label: "Miradores", value: allPlaces.filter((p) => p.category === "mirador").length },
    { icon: ShoppingBag, label: "Compras", value: allPlaces.filter((p) => p.category === "compras").length },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {globalStats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-2.5 text-center">
          <s.icon className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-base font-bold leading-none text-foreground">{s.value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
