import {
  Train,
  Mountain,
  Landmark,
  Trees,
  Ship,
  ShoppingBag,
  UtensilsCrossed,
  Building2,
  MapPin,
  Church,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/data/itinerary";

export const CATEGORY_META: Record<Category, { icon: LucideIcon; color: string }> = {
  estacion: { icon: Train, color: "#0ea5e9" },
  mirador: { icon: Mountain, color: "#f59e0b" },
  museo: { icon: Landmark, color: "#a855f7" },
  parque: { icon: Trees, color: "#22c55e" },
  ferry: { icon: Ship, color: "#06b6d4" },
  compras: { icon: ShoppingBag, color: "#ec4899" },
  restaurante: { icon: UtensilsCrossed, color: "#ef4444" },
  monumento: { icon: Building2, color: "#f97316" },
  barrio: { icon: MapPin, color: "#14b8a6" },
  iglesia: { icon: Church, color: "#8b5cf6" },
  atraccion: { icon: Ticket, color: "#eab308" },
};
