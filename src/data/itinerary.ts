// Datos del itinerario familiar Nueva York + Stamford.
// Las coordenadas fueron geocodificadas con la API de OpenStreetMap (Nominatim)
// y cacheadas aquí para una carga rápida y fiable.

export type Category =
  | "estacion"
  | "mirador"
  | "museo"
  | "parque"
  | "ferry"
  | "compras"
  | "restaurante"
  | "monumento"
  | "barrio"
  | "iglesia"
  | "atraccion";

export interface Place {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  order: number;
  description: string;
  seeWhat?: string[];
  food?: string;
}

export interface Tour {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: string;
  description: string;
  pace?: string;
  places: Place[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  estacion: "Estación",
  mirador: "Mirador",
  museo: "Museo",
  parque: "Parque",
  ferry: "Ferry",
  compras: "Compras",
  restaurante: "Restaurante",
  monumento: "Monumento",
  barrio: "Barrio",
  iglesia: "Iglesia",
  atraccion: "Atracción",
};

export const tours: Tour[] = [
  {
    id: "tour-1",
    number: 1,
    title: "Midtown clásico",
    subtitle: "Primera impresión de Nueva York",
    color: "#ef4444",
    description:
      "Reúne muchos de los iconos más famosos. Ideal como primer o segundo día porque deja a todo el grupo situado mentalmente en Manhattan.",
    pace: "Si subís a SUMMIT y a Top of the Rock el mismo día queda demasiado cargado. Elegid solo un gran mirador.",
    places: [
      { id: "grand-central", name: "Grand Central Terminal", category: "estacion", lat: 40.752726, lng: -73.977229, order: 1, description: "Entrad sin prisa y disfrutad del edificio como una atracción en sí misma. Conecta con las líneas 4, 5, 6, 7 y Shuttle.", seeWhat: ["Gran vestíbulo", "Techo astronómico", "Vanderbilt Hall"], food: "Desayuno rápido o parada técnica en Vanderbilt Hall." },
      { id: "summit-ovt", name: "SUMMIT One Vanderbilt", category: "mirador", lat: 40.752854, lng: -73.978674, order: 2, description: "Mirador inmersivo justo al lado de Grand Central, muy cómodo logísticamente.", seeWhat: ["Skyline de Midtown", "Experiencia de espejos"] },
      { id: "nypl", name: "Biblioteca Pública de Nueva York", category: "monumento", lat: 40.753182, lng: -73.982253, order: 3, description: "La biblioteca impresiona por dentro y por fuera; combina perfecto con Bryant Park.", seeWhat: ["Rose Main Reading Room", "Leones de mármol"] },
      { id: "bryant-park", name: "Bryant Park", category: "parque", lat: 40.753596, lng: -73.983233, order: 4, description: "Ofrece bancos, sombra y baño público útil para el grupo. Buen punto de descanso entre grandes avenidas.", food: "Café, sándwich, ensaladas o bollería para pica-pica rápido." },
      { id: "fifth-avenue", name: "5th Avenue", category: "compras", lat: 40.7607, lng: -73.9748, order: 5, description: "Tiendas icónicas y ambiente clásico de Midtown de camino al Rockefeller Center." },
      { id: "st-patrick", name: "Catedral de St. Patrick", category: "iglesia", lat: 40.758465, lng: -73.975993, order: 6, description: "Catedral neogótica imponente en plena 5th Avenue.", seeWhat: ["Fachada neogótica", "Vidrieras"] },
      { id: "rockefeller", name: "Rockefeller Center", category: "atraccion", lat: 40.758740, lng: -73.978674, order: 7, description: "Conjunto icónico de Midtown con plaza, tiendas y ambiente clásico." },
      { id: "top-of-the-rock", name: "Top of the Rock", category: "mirador", lat: 40.759306, lng: -73.978969, order: 8, description: "Mirador alternativo al Empire State, con vistas directas a Central Park y al Empire.", seeWhat: ["Vista del Empire State", "Central Park desde el aire"] },
      { id: "times-square", name: "Times Square", category: "atraccion", lat: 40.758000, lng: -73.985500, order: 9, description: "Verlo una vez bien visto, sin dedicarle demasiadas horas.", seeWhat: ["Pantallas gigantes", "Broadway"] },
      { id: "koreatown", name: "Koreatown", category: "restaurante", lat: 40.747900, lng: -73.986900, order: 10, description: "Una de las mejores zonas para comer bien y con variedad.", food: "Dumplings, noodles y BBQ coreana." },
      { id: "empire-state", name: "Empire State Building", category: "mirador", lat: 40.748417, lng: -73.985738, order: 11, description: "Cerrar el día con el exterior del edificio más emblemático de Nueva York.", seeWhat: ["Fachada Art Déco", "Mirador opcional"] },
      { id: "msg", name: "Madison Square Garden", category: "atraccion", lat: 40.750504, lng: -73.993439, order: 12, description: "Zona final del recorrido, junto a Penn Station." },
    ],
  },
  {
    id: "tour-2",
    number: 2,
    title: "Lower Manhattan",
    subtitle: "9/11, Oculus y distrito financiero",
    color: "#f97316",
    description:
      "Un día muy completo pero muy lógico: casi todo queda enlazado caminando. Mezcla arquitectura, historia y vistas al agua.",
    pace: "Si los padres se cansan, es fácil de recortar: eliminar el museo 9/11 y dejar solo memorial + financiero.",
    places: [
      { id: "fulton-st", name: "Fulton Street", category: "estacion", lat: 40.709913, lng: -74.007846, order: 1, description: "Punto de llegada desde Grand Central con las líneas 4 o 5." },
      { id: "oculus", name: "Oculus", category: "atraccion", lat: 40.711522, lng: -74.011080, order: 2, description: "Estructura espectacular junto al World Trade Center. Vale la pena verlo por dentro.", seeWhat: ["Arquitectura de Calatrava", "Bóveda blanca"], food: "Muchas opciones cómodas y limpias para comer." },
      { id: "911-memorial", name: "9/11 Memorial", category: "monumento", lat: 40.711522, lng: -74.013396, order: 3, description: "El memorial exterior transmite mucho y es menos exigente que el museo.", seeWhat: ["Estanques memoriales", "Survivor Tree"] },
      { id: "911-museum", name: "Museo 9/11", category: "museo", lat: 40.711330, lng: -74.012437, order: 4, description: "Solo si os apetece profundizar en la historia del 11-S." },
      { id: "trinity-church", name: "Trinity Church", category: "iglesia", lat: 40.708124, lng: -74.012212, order: 5, description: "Iglesia histórica con su cementerio en pleno distrito financiero.", seeWhat: ["Cementerio histórico", "Arquitectura gótica"] },
      { id: "wall-street", name: "Wall Street", category: "atraccion", lat: 40.706877, lng: -74.008896, order: 6, description: "El corazón del distrito financiero." },
      { id: "federal-hall", name: "Federal Hall", category: "monumento", lat: 40.707428, lng: -74.010201, order: 7, description: "Edificio histórico con la estatua de George Washington." },
      { id: "nyse", name: "Bolsa de Nueva York", category: "monumento", lat: 40.706913, lng: -74.011322, order: 8, description: "La fachada de la New York Stock Exchange." },
      { id: "charging-bull", name: "Charging Bull", category: "monumento", lat: 40.705573, lng: -74.013420, order: 9, description: "El toro de bronce, icono del distrito financiero." },
      { id: "stone-street", name: "Stone Street", category: "restaurante", lat: 40.704224, lng: -74.011322, order: 10, description: "Calle histórica con terrazas y ambiente agradable para comer sin desvíos.", food: "La mejor opción para algo con ambiente de sobremesa." },
      { id: "battery-park", name: "Battery Park", category: "parque", lat: 40.703277, lng: -74.017028, order: 11, description: "Cierre junto al agua con vistas a la Estatua de la Libertad.", seeWhat: ["Vistas de la Estatua de la Libertad", "Paseo marítimo"] },
      { id: "battery-park-city", name: "Battery Park City", category: "barrio", lat: 40.711500, lng: -74.016000, order: 12, description: "Zona tranquila junto al río para un café o helado al final.", food: "Café o helado tranquilo." },
    ],
  },
  {
    id: "tour-3",
    number: 3,
    title: "Staten Island Ferry",
    subtitle: "Battery Park y Bowling Green",
    color: "#eab308",
    description:
      "De los tours más agradecidos para un grupo familiar: da sensación de hacer mucho con poco esfuerzo. El ferry es gratuito y ofrece una de las mejores vistas de la Estatua de la Libertad.",
    pace: "Funciona especialmente bien como día suave entre dos días de mucha caminata.",
    places: [
      { id: "bowling-green", name: "Bowling Green", category: "parque", lat: 40.704708, lng: -74.013844, order: 1, description: "Parada de metro y pequeño parque histórico, punto de inicio del recorrido." },
      { id: "si-ferry", name: "Staten Island Ferry", category: "ferry", lat: 40.701231, lng: -74.013403, order: 2, description: "Sentaos en la parte exterior si hace buen tiempo, en el lado de Manhattan/Liberty Island.", seeWhat: ["Vistas de la Estatua de la Libertad", "Skyline alejándose"], food: "Algo ligero en Lower Manhattan antes de embarcar." },
      { id: "st-george", name: "St. George Terminal", category: "ferry", lat: 40.643748, lng: -74.073463, order: 3, description: "Bajada en Staten Island: paseo corto, baños y regreso sin complicarse.", food: "Snack breve y baño." },
      { id: "empire-outlets-si", name: "Empire Outlets", category: "compras", lat: 40.643300, lng: -74.073800, order: 4, description: "Outlet justo al lado de St. George, fácil de combinar con el ferry." },
    ],
  },
  {
    id: "tour-4",
    number: 4,
    title: "Brooklyn + DUMBO",
    subtitle: "Puente, Chinatown y Little Italy",
    color: "#84cc16",
    description:
      "Uno de los días más fotogénicos y variados. La clave es el orden correcto para evitar repetir puente y llegar a comer con calma.",
    pace: "Si hace mucho calor, mejor hacer el puente temprano y dejar Chinatown/Little Italy para después de comer.",
    places: [
      { id: "brooklyn-bridge", name: "Puente de Brooklyn", category: "monumento", lat: 40.706086, lng: -73.996864, order: 1, description: "Cruzar andando sin prisa: lo bonito es parar, mirar y hacer fotos.", seeWhat: ["Skyline de Manhattan", "Arcos de piedra"] },
      { id: "dumbo", name: "DUMBO", category: "barrio", lat: 40.703277, lng: -73.990322, order: 2, description: "Ver Washington Street, el skyline y el paseo junto al agua.", seeWhat: ["Manhattan Bridge enmarcado", "Paseo del río"], food: "Pizza clásica con vistas." },
      { id: "washington-st", name: "Washington Street", category: "atraccion", lat: 40.703605, lng: -73.989000, order: 3, description: "La calle más fotografiada de DUMBO, con el Manhattan Bridge al fondo." },
      { id: "pebble-beach", name: "Pebble Beach (Brooklyn Bridge Park)", category: "parque", lat: 40.703600, lng: -73.995600, order: 4, description: "Pequeña playa de guijarros con vistas al puente y al skyline." },
      { id: "janes-carousel", name: "Jane's Carousel", category: "atraccion", lat: 40.702700, lng: -73.993400, order: 5, description: "Carrusel histórico junto al río, bonito al menos por fuera." },
      { id: "chinatown", name: "Chinatown", category: "barrio", lat: 40.715800, lng: -73.997000, order: 6, description: "Funciona mejor como paseo corto + comida que como visita larga.", food: "Dumplings, noodles o dim sum, pica-pica económico." },
      { id: "little-italy", name: "Little Italy", category: "barrio", lat: 40.719100, lng: -73.997300, order: 7, description: "Ambiente italiano clásico para un paseo corto.", food: "Pasta, cannoli o café tranquilo." },
      { id: "soho", name: "SoHo", category: "compras", lat: 40.723301, lng: -74.003000, order: 8, description: "Fachadas de hierro colado, tiendas bonitas y ambiente descansado para los mayores." },
      { id: "nolita", name: "Nolita", category: "barrio", lat: 40.722200, lng: -73.995400, order: 9, description: "Zona agradable para pasear y comprar, más tranquila que Canal Street." },
    ],
  },
  {
    id: "tour-5",
    number: 5,
    title: "Central Park",
    subtitle: "Relajado, zoo y toque de series",
    color: "#22c55e",
    description:
      "Este día debe sentirse como descanso activo. Central Park es enorme: conviene escoger bien el tramo y no intentar verlo todo.",
    pace: "No mezclar con demasiados museos o miradores. Su función es bajar revoluciones.",
    places: [
      { id: "the-pond", name: "The Pond", category: "parque", lat: 40.766500, lng: -73.974000, order: 1, description: "Entrada por la zona sur del parque, cerca de 5th Avenue." },
      { id: "bethesda-terrace", name: "Bethesda Terrace", category: "atraccion", lat: 40.774000, lng: -73.970900, order: 2, description: "Una de las zonas más bellas del parque, con su fuente y arcadas." },
      { id: "bow-bridge", name: "Bow Bridge", category: "atraccion", lat: 40.775700, lng: -73.971600, order: 3, description: "El puente romántico más famoso de Central Park.", seeWhat: ["Vistas sobre el lago"] },
      { id: "strawberry-fields", name: "Strawberry Fields", category: "monumento", lat: 40.775900, lng: -73.975800, order: 4, description: "Memorial a John Lennon con el mosaico Imagine." },
      { id: "the-mall", name: "The Mall", category: "parque", lat: 40.771800, lng: -73.971900, order: 5, description: "El paseo arbolado más icónico del parque." },
      { id: "central-park-zoo", name: "Central Park Zoo", category: "atraccion", lat: 40.767800, lng: -73.971800, order: 6, description: "Parada ligera y diferente, ideal para el grupo." },
      { id: "friends-building", name: "Edificio de Friends", category: "atraccion", lat: 40.732100, lng: -74.006100, order: 7, description: "El edificio exterior de la serie Friends en Bedford Street, West Village." },
      { id: "friends-experience", name: "Friends Experience", category: "atraccion", lat: 40.741500, lng: -73.989700, order: 8, description: "Experiencia inmersiva para fans de la serie." },
      { id: "amnh", name: "Museo de Historia Natural", category: "museo", lat: 40.781324, lng: -73.973988, order: 9, description: "Excelente para todas las edades; gusta a casi cualquiera y se camina poco entre salas.", seeWhat: ["Esqueletos de dinosaurios", "Ballena azul", "Planetario"] },
      { id: "upper-west-side", name: "Upper West Side", category: "barrio", lat: 40.787000, lng: -73.975400, order: 10, description: "Cafeterías y restaurantes muy cómodos si salís por el oeste.", food: "Cafeterías y restaurantes acogedores." },
      { id: "west-village", name: "West Village", category: "barrio", lat: 40.735800, lng: -74.003600, order: 11, description: "Ambiente encantador si decidís terminar con Friends." },
    ],
  },
  {
    id: "tour-6",
    number: 6,
    title: "Roosevelt Island",
    subtitle: "Teleférico y Upper East Side",
    color: "#14b8a6",
    description:
      "Puede quedar muy bonito y descansado. El teleférico ofrece vistas estupendas del East River y es una experiencia corta y diferente.",
    pace: "Ideal como día corto, para volver antes a Stamford o ver partido después.",
    places: [
      { id: "roosevelt-tram", name: "Roosevelt Island Tramway", category: "atraccion", lat: 40.761400, lng: -73.963900, order: 1, description: "Subid al teleférico en 59th Street / 2nd Avenue.", seeWhat: ["Vistas del East River", "Puente de Queensboro"] },
      { id: "roosevelt-island", name: "Roosevelt Island", category: "barrio", lat: 40.761500, lng: -73.950500, order: 2, description: "Pasear sin prisa; lo mejor es el ambiente y la sensación de salir del Manhattan clásico." },
      { id: "southpoint-park", name: "Southpoint Park", category: "parque", lat: 40.748900, lng: -73.957300, order: 3, description: "Paseo más largo con vistas abiertas al sur de la isla." },
      { id: "smallpox-hospital", name: "Smallpox Hospital", category: "monumento", lat: 40.748000, lng: -73.958000, order: 4, description: "Ruinas históricas con un encanto especial al atardecer." },
      { id: "bloomingdales", name: "Bloomingdale's", category: "compras", lat: 40.762100, lng: -73.967600, order: 5, description: "Compras suaves al regresar a Manhattan." },
      { id: "upper-east-side", name: "Upper East Side", category: "barrio", lat: 40.773600, lng: -73.956600, order: 6, description: "Barrio elegante para café o comida ligera.", food: "Brunch o comida temprana muy cómoda." },
    ],
  },
  {
    id: "tour-7",
    number: 7,
    title: "Museos",
    subtitle: "The Met o MoMA, no los dos a fondo",
    color: "#06b6d4",
    description:
      "Elegir un museo protagonista por día y, si queda energía, añadir otro muy breve o solo el exterior.",
    pace: "Este tour debe ser cultural y contenido, no una acumulación de entradas.",
    places: [
      { id: "the-met", name: "The Met", category: "museo", lat: 40.779437, lng: -73.963244, order: 1, description: "Uno de los grandes imprescindibles: un gran museo con piezas muy reconocibles y visita elegante. Sobre la Museum Mile.", seeWhat: ["Templo de Dendur", "Galerías europeas", "Terraza con vistas"], food: "Cafetería dentro o almuerzo cerca." },
      { id: "moma", name: "MoMA", category: "museo", lat: 40.761436, lng: -73.977621, order: 2, description: "Encaja con un día de Midtown, muy cerca de Rockefeller y 5th Avenue. Haced selección interna.", seeWhat: ["La noche estrellada", "Las señoritas de Aviñón"] },
      { id: "guggenheim", name: "Guggenheim", category: "museo", lat: 40.782999, lng: -73.958957, order: 3, description: "Merece la pena fijarse en su exterior aunque no entréis.", seeWhat: ["Espiral de Frank Lloyd Wright"] },
      { id: "museum-mile", name: "Museum Mile", category: "atraccion", lat: 40.780000, lng: -73.959000, order: 4, description: "Paseo por la 5th Avenue cultural, junto a Central Park." },
    ],
  },
  {
    id: "tour-8",
    number: 8,
    title: "High Line + Chelsea",
    subtitle: "Chelsea Market, Little Island y Hudson Yards",
    color: "#3b82f6",
    description:
      "Una de las zonas más agradables y actuales de Manhattan. Combina muy bien paseo, comida y miradores sin la locura de Midtown.",
    pace: "Muy bueno para adultos porque es modular: solo Chelsea + High Line, o todo con Edge si estáis fuertes.",
    places: [
      { id: "chelsea-market", name: "Chelsea Market", category: "restaurante", lat: 40.742400, lng: -74.006100, order: 1, description: "Perfecto para desayunar tarde o comer pronto.", seeWhat: ["Mercado gastronómico", "Puestos artesanales"], food: "Donde mejor funciona el tour: comer bien sin restaurante formal." },
      { id: "high-line", name: "High Line", category: "parque", lat: 40.748000, lng: -74.004800, order: 2, description: "Paseo elevado de unos 3 km con otra perspectiva de la ciudad.", seeWhat: ["Jardines elevados", "Vistas del Hudson"] },
      { id: "little-island", name: "Little Island", category: "parque", lat: 40.742000, lng: -74.011000, order: 3, description: "Parque muy fotogénico y agradable junto al río Hudson. Bonito, gratis y descansado.", food: "Helado o café junto al río." },
      { id: "hudson-yards", name: "Hudson Yards", category: "atraccion", lat: 40.753900, lng: -74.002100, order: 4, description: "Zona moderna con tiendas y restaurantes." },
      { id: "vessel", name: "Vessel", category: "atraccion", lat: 40.753800, lng: -74.001900, order: 5, description: "Estructura escultórica icónica; ver el exterior." },
      { id: "edge", name: "Edge", category: "mirador", lat: 40.753600, lng: -74.001700, order: 6, description: "Mirador grande del día, ideal al atardecer.", seeWhat: ["Suelo de cristal", "Vistas 360º"], food: "Cena temprana en Hudson Yards si subís al atardecer." },
    ],
  },
  {
    id: "tour-9",
    number: 9,
    title: "Harlem",
    subtitle: "Misa góspel y comida soul",
    color: "#8b5cf6",
    description:
      "Una Nueva York distinta, menos de postal y más de barrio con identidad. Si os interesa, mejor en domingo para la misa góspel.",
    pace: "Muy recomendable, pero solo si os atrae de verdad la parte cultural y no vais con prisa por tachar sitios.",
    places: [
      { id: "harlem", name: "Harlem", category: "barrio", lat: 40.811600, lng: -73.946500, order: 1, description: "Subir por la mañana en metro y pasear por sus calles clásicas.", seeWhat: ["Brownstones", "Arquitectura residencial"] },
      { id: "gospel-church", name: "Misa góspel (Abyssinian Baptist)", category: "iglesia", lat: 40.815800, lng: -73.941200, order: 2, description: "Asistir respetando que es un acto religioso y no solo un espectáculo turístico." },
      { id: "soul-food", name: "Soul food (Sylvia's)", category: "restaurante", lat: 40.808600, lng: -73.944400, order: 3, description: "Comer soul food en un sitio histórico es parte fundamental de la experiencia.", food: "Soul food: aquí la comida forma parte del plan." },
      { id: "apollo-theater", name: "Apollo Theater", category: "atraccion", lat: 40.809900, lng: -73.950100, order: 4, description: "Pasar por fuera del mítico teatro de Harlem." },
    ],
  },
  {
    id: "tour-10",
    number: 10,
    title: "Compras",
    subtitle: "Opciones realistas con transporte público",
    color: "#ec4899",
    description:
      "Separar tres categorías: compras urbanas en Manhattan, outlet fácil y outlet grande pero cansado. Así evitáis trayectos larguísimos.",
    pace: "Para padres mayores, lo mejor suele ser Manhattan + SoHo o Empire Outlets. Jersey Gardens sería la opción intermedia.",
    places: [
      { id: "herald-square", name: "Herald Square", category: "compras", lat: 40.750500, lng: -73.987900, order: 1, description: "Centro comercial urbano en pleno Midtown." },
      { id: "macys", name: "Macy's", category: "compras", lat: 40.751000, lng: -73.988800, order: 2, description: "Los grandes almacenes más famosos de Nueva York." },
      { id: "century-21", name: "Century 21", category: "compras", lat: 40.710000, lng: -74.011000, order: 3, description: "Descuentos en moda cerca del distrito financiero." },
      { id: "jersey-gardens", name: "Jersey Gardens", category: "compras", lat: 40.664000, lng: -74.169000, order: 4, description: "Clásico de compras accesible en transporte público/bus desde la ciudad." },
      { id: "woodbury-common", name: "Woodbury Common", category: "compras", lat: 41.334000, lng: -74.118000, order: 5, description: "El outlet más famoso y fuerte en marcas, pero el que más castiga por distancia." },
    ],
  },
  {
    id: "tour-11",
    number: 11,
    title: "Stamford",
    subtitle: "Playa, casa, piscina y respiro",
    color: "#64748b",
    description:
      "No es relleno: es esencial para que Nueva York no os pase factura. Evitad el error de intentar hacer Manhattan todos los días.",
    pace: "Los itinerarios largos funcionan mejor con días domésticos y sencillos.",
    places: [
      { id: "stamford-station", name: "Stamford Train Station", category: "estacion", lat: 41.046900, lng: -73.542000, order: 1, description: "Base del viaje. El tren a Grand Central tarda unos 55–60 minutos.", seeWhat: ["Metro-North New Haven Line"] },
      { id: "stamford-downtown", name: "Stamford", category: "barrio", lat: 41.053400, lng: -73.538700, order: 2, description: "Mañana lenta, paseo local y comida en casa." },
      { id: "cove-island", name: "Cove Island Park", category: "parque", lat: 41.042000, lng: -73.518000, order: 3, description: "Playa cercana y paseo local para un día tranquilo." },
    ],
  },
  {
    id: "tour-12",
    number: 12,
    title: "Niagara Falls",
    subtitle: "Excursión económica en bus",
    color: "#0ea5e9",
    description:
      "Niágara en bus nocturno y volver el mismo día es una paliza, pero reduce gasto. Concentrarse en el lado estadounidense, miradores gratuitos.",
    pace: "No colocar pegado a un día fuerte de Manhattan. Mejor con un día de descanso antes o después.",
    places: [
      { id: "niagara-park", name: "Niagara Falls State Park", category: "parque", lat: 43.082800, lng: -79.065300, order: 1, description: "El acceso a miradores y zona exterior es gratuito. Se pagan atracciones concretas.", seeWhat: ["Miradores exteriores", "Observation Tower"] },
      { id: "american-falls", name: "American Falls", category: "atraccion", lat: 43.084000, lng: -79.068600, order: 2, description: "Las cataratas del lado estadounidense, perfectas para fotos." },
      { id: "bridal-veil", name: "Bridal Veil Falls", category: "atraccion", lat: 43.079600, lng: -79.069900, order: 3, description: "La más pequeña de las tres cataratas, junto a Luna Island." },
      { id: "horseshoe-falls", name: "Horseshoe Falls", category: "atraccion", lat: 43.077900, lng: -79.074700, order: 4, description: "Las cataratas en forma de herradura, las más impresionantes vistas desde lejos." },
    ],
  },
];

export const allPlaces: (Place & { tourId: string; tourTitle: string; tourColor: string })[] =
  tours.flatMap((t) =>
    t.places.map((p) => ({ ...p, tourId: t.id, tourTitle: `Tour ${t.number}: ${t.title}`, tourColor: t.color })),
  );
