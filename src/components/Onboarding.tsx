import { useState, useEffect } from 'react';
import { Map, List, Navigation, Heart, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function Onboarding({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('nyc-onboarding-seen');
    if (!seen) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('nyc-onboarding-seen', 'true');
      setIsVisible(false);
      onComplete?.();
    }, 400); // Wait for fade out animation
  };

  const nextSlide = () => {
    if (current === count) {
      handleClose();
    } else {
      api?.scrollNext();
    }
  };

  const slides = [
    {
      icon: <Heart className="h-12 w-12 text-red-500 animate-pulse" />,
      bg: "bg-red-500/10",
      title: "¡Bienvenidos a Nueva York!",
      description: "Esta guía fue hecha especialmente para ustedes. Aquí tienen todo su viaje organizado, sin estrés y de forma muy fácil."
    },
    {
      icon: <List className="h-12 w-12 text-blue-500" />,
      bg: "bg-blue-500/15",
      title: "1. Su Itinerario",
      description: "En la pantalla principal verán la lista de días. Solo toquen el día de hoy y verán todos los lugares que visitarán."
    },
    {
      icon: <MapPin className="h-12 w-12 text-emerald-500" />,
      bg: "bg-emerald-500/15",
      title: "2. Nunca se perderán",
      description: "En el Mapa, el punto azul son ustedes. Si mueven el mapa y se pierden, toquen el botón de la esquina para volver a su ubicación."
    },
    {
      icon: <Navigation className="h-12 w-12 text-amber-500" />,
      bg: "bg-amber-500/15",
      title: "3. ¿Cómo llegar?",
      description: "Al tocar cualquier lugar, verán un botón que dice 'Llévame hasta aquí'. Los guiará paso a paso caminando o en metro."
    },
    {
      icon: <CheckCircle2 className="h-12 w-12 text-purple-500" />,
      bg: "bg-purple-500/15",
      title: "¡A disfrutar!",
      description: "Marquen con un ✔️ los lugares que ya visitaron. Relájense, sigan la ruta y tómense muchas fotos hermosas. ¡Buen viaje!"
    }
  ];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-400 ${isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}>
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-card p-6 sm:p-8 text-center shadow-2xl border border-border animate-fade-in-up">
        
        <Carousel setApi={setApi} className="w-full cursor-grab active:cursor-grabbing">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className={`mb-6 grid h-24 w-24 place-items-center rounded-full ${slide.bg}`}>
                    {slide.icon}
                  </div>
                  <h2 className="mb-4 text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed px-2 sm:px-4 font-medium">
                    {slide.description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex flex-col items-center gap-6">
          {/* Indicadores de progreso (Puntos) */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`h-2.5 rounded-full transition-all duration-300 ${current === index + 1 ? 'w-8 bg-foreground' : 'w-2.5 bg-muted'}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-foreground text-xl font-bold text-background shadow-lg transition hover:opacity-90 active:scale-95"
          >
            {current === count ? (
              <>
                <CheckCircle2 className="h-6 w-6" />
                ¡Empezar el viaje!
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="h-6 w-6 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
