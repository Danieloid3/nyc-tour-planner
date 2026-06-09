import { useState, useEffect } from 'react';
import { Map, List, Navigation, Heart, CheckCircle2 } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('nyc-onboarding-seen');
    if (!seen) {
      // Small delay to allow the app to load before showing the overlay
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('nyc-onboarding-seen', 'true');
      setIsVisible(false);
      onComplete?.();
    }, 400); // Wait for fade out animation
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-400 ${isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}>
      <div className="absolute inset-0 bg-background/40 backdrop-blur-xl" />
      
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-card p-8 text-center shadow-2xl border border-border animate-fade-in-up">
        
        {/* Decorative Header */}
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10">
          <Heart className="h-10 w-10 text-primary animate-pulse" />
        </div>

        <h2 className="mb-2 text-3xl font-black tracking-tight text-foreground">
          ¡Bienvenidos a Nueva York!
        </h2>
        <p className="mb-8 text-[16px] text-muted-foreground leading-relaxed">
          Esta guía está diseñada para que disfruten la ciudad sin estrés y a su propio ritmo.
        </p>

        <div className="mb-10 space-y-6 text-left">
          
          <div className="flex items-start gap-4">
            <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <List className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-foreground">1. Elijan su día</h3>
              <p className="text-[14px] text-muted-foreground leading-snug mt-1">
                Abran la lista y seleccionen el plan de hoy. Está todo organizado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/30 text-foreground">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-foreground">2. Exploren el mapa</h3>
              <p className="text-[14px] text-muted-foreground leading-snug mt-1">
                Toquen cualquier punto para ver datos curiosos e información.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/60 text-foreground">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-foreground">3. Déjense llevar</h3>
              <p className="text-[14px] text-muted-foreground leading-snug mt-1">
                Usen el botón gigante para que Google Maps los guíe paso a paso.
              </p>
            </div>
          </div>

        </div>

        <button
          onClick={handleClose}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[16px] font-black text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-95"
        >
          <CheckCircle2 className="h-5 w-5" /> ¡Empezar el viaje!
        </button>
      </div>
    </div>
  );
}
