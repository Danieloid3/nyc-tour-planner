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

export const CATEGORY_META: Record<Category, { icon: LucideIcon; emoji: string; color: string }> = {
  estacion: { icon: Train, emoji: "🚆", color: "#0ea5e9" },
  mirador: { icon: Mountain, emoji: "🌆", color: "#f59e0b" },
  museo: { icon: Landmark, emoji: "🏛️", color: "#a855f7" },
  parque: { icon: Trees, emoji: "🌳", color: "#22c55e" },
  ferry: { icon: Ship, emoji: "⛴️", color: "#06b6d4" },
  compras: { icon: ShoppingBag, emoji: "🛍️", color: "#ec4899" },
  restaurante: { icon: UtensilsCrossed, emoji: "🍽️", color: "#ef4444" },
  monumento: { icon: Building2, emoji: "🗽", color: "#f97316" },
  barrio: { icon: MapPin, emoji: "📍", color: "#14b8a6" },
  iglesia: { icon: Church, emoji: "⛪", color: "#8b5cf6" },
  atraccion: { icon: Ticket, emoji: "🎡", color: "#eab308" },
};
