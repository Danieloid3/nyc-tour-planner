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
  curiosity?: string;
}

export interface DayPlan {
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

export const days: DayPlan[] = [
  {
    id: "day-1",
    number: 1,
    title: "Midtown clásico",
    subtitle: "Primera impresión de Nueva York",
    color: "#ef4444",
    description:
      "Reúne muchos de los iconos más famosos. Ideal como primer o segundo día porque deja a todo el grupo situado mentalmente en Manhattan.",
    pace: "Si subís a SUMMIT y a Top of the Rock el mismo día queda demasiado cargado. Elegid solo un gran mirador.",
    places: [
      { id: "grand-central", name: "Grand Central Terminal", category: "estacion", lat: 40.752726, lng: -73.977229, order: 1, description: "Entrad sin prisa y disfrutad del edificio como una atracción en sí misma. Conecta con las líneas 4, 5, 6, 7 y Shuttle.", seeWhat: ["Gran vestíbulo", "Techo astronómico", "Vanderbilt Hall"], food: "Desayuno rápido o parada técnica en Vanderbilt Hall.", curiosity: "El techo estrellado del vestíbulo principal está pintado al revés. Cornelius Vanderbilt afirmó que era a propósito para verlo 'desde la perspectiva de Dios'." },
      { id: "summit-ovt", name: "SUMMIT One Vanderbilt", category: "mirador", lat: 40.752854, lng: -73.978674, order: 2, description: "Mirador inmersivo justo al lado de Grand Central, muy cómodo logísticamente.", seeWhat: ["Skyline de Midtown", "Experiencia de espejos"], curiosity: "Los espejos del Summit One Vanderbilt cubren más de 2,700 metros cuadrados, creando una ilusión de espacio infinito que te hace perder la noción de dónde estás." },
      { id: "nypl", name: "Biblioteca Pública de Nueva York", category: "monumento", lat: 40.753182, lng: -73.982253, order: 3, description: "La biblioteca impresiona por dentro y por fuera; combina perfecto con Bryant Park.", seeWhat: ["Rose Main Reading Room", "Leones de mármol"], curiosity: "Los famosos leones de mármol de la entrada se llamaban originalmente Leo Astor y Leo Lenox, pero en la Gran Depresión fueron rebautizados como 'Paciencia' y 'Fortaleza'." },
      { id: "bryant-park", name: "Bryant Park", category: "parque", lat: 40.753596, lng: -73.983233, order: 4, description: "Ofrece bancos, sombra y baño público útil para el grupo. Buen punto de descanso entre grandes avenidas.", food: "Café, sándwich, ensaladas o bollería para pica-pica rápido.", curiosity: "Debajo del césped de este parque hay dos pisos enteros llenos de libros almacenados que pertenecen a la Biblioteca Pública de Nueva York." },
      { id: "fifth-avenue", name: "5th Avenue", category: "compras", lat: 40.7607, lng: -73.9748, order: 5, description: "Tiendas icónicas y ambiente clásico de Midtown de camino al Rockefeller Center.", curiosity: "Esta avenida es la línea divisoria oficial entre el 'East Side' y el 'West Side' de Manhattan. Aquí es donde los números de las calles cambian de Este a Oeste." },
      { id: "st-patrick", name: "Catedral de St. Patrick", category: "iglesia", lat: 40.758465, lng: -73.975993, order: 6, description: "Catedral neogótica imponente en plena 5th Avenue.", seeWhat: ["Fachada neogótica", "Vidrieras"], curiosity: "Tardaron 21 años en construirla, interrumpiendo las obras por la Guerra Civil. Hoy sus agujas parecen pequeñas, pero en 1878 era el edificio más alto de NY." },
      { id: "rockefeller", name: "Rockefeller Center", category: "atraccion", lat: 40.758740, lng: -73.978674, order: 7, description: "Conjunto icónico de Midtown con plaza, tiendas y ambiente clásico.", curiosity: "En invierno, su famoso árbol de Navidad consume más de 50.000 luces LED, y cuando se retira, la madera se dona para construir casas para los más necesitados." },
      { id: "top-of-the-rock", name: "Top of the Rock", category: "mirador", lat: 40.759306, lng: -73.978969, order: 8, description: "Mirador alternativo al Empire State, con vistas directas a Central Park y al Empire.", seeWhat: ["Vista del Empire State", "Central Park desde el aire"], curiosity: "Fue diseñado originalmente para parecerse a la cubierta de un lujoso transatlántico, por eso verás detalles náuticos y barandillas que parecen de un barco." },
      { id: "times-square", name: "Times Square", category: "atraccion", lat: 40.758000, lng: -73.985500, order: 9, description: "Verlo una vez bien visto, sin dedicarle demasiadas horas.", seeWhat: ["Pantallas gigantes", "Broadway"], curiosity: "Originalmente se llamaba Longacre Square. Cambió su nombre en 1904 cuando el periódico The New York Times mudó allí su sede central." },
      { id: "koreatown", name: "Koreatown", category: "restaurante", lat: 40.747900, lng: -73.986900, order: 10, description: "Una de las mejores zonas para comer bien y con variedad.", food: "Dumplings, noodles y BBQ coreana.", curiosity: "Aunque ocupa apenas una cuadra (la calle 32), la mayoría de los restaurantes coreanos aquí son auténticos rascacielos 'verticales' con negocios hasta en los pisos más altos." },
      { id: "empire-state", name: "Empire State Building", category: "mirador", lat: 40.748417, lng: -73.985738, order: 11, description: "Cerrar el día con el exterior del edificio más emblemático de Nueva York.", seeWhat: ["Fachada Art Déco", "Mirador opcional"], curiosity: "Tiene su propio código postal (10118) y sus luces LED superiores pueden mostrar más de 16 millones de combinaciones de colores distintas." },
      { id: "msg", name: "Madison Square Garden", category: "atraccion", lat: 40.750504, lng: -73.993439, order: 12, description: "Zona final del recorrido, junto a Penn Station.", curiosity: "Es el estadio en activo más antiguo de la NBA y de la NHL, pero curiosamente no está sobre suelo firme, ¡sino que fue construido justo encima de la estación de tren Penn Station!" },
    ],
  },
  {
    id: "day-2",
    number: 2,
    title: "Lower Manhattan",
    subtitle: "9/11, Oculus y distrito financiero",
    color: "#f97316",
    description:
      "Un día muy completo pero muy lógico: casi todo queda enlazado caminando. Mezcla arquitectura, historia y vistas al agua.",
    pace: "Si los padres se cansan, es fácil de recortar: eliminar el museo 9/11 y dejar solo memorial + financiero.",
    places: [
      { id: "fulton-st", name: "Fulton Street", category: "estacion", lat: 40.709913, lng: -74.007846, order: 1, description: "Punto de llegada desde Grand Central con las líneas 4 o 5.", curiosity: "La estación de metro Fulton Center tiene un tragaluz gigante llamado 'Sky Reflector-Net' compuesto por 952 paneles de aluminio que bajan la luz solar hasta las vías." },
      { id: "oculus", name: "Oculus", category: "atraccion", lat: 40.711522, lng: -74.011080, order: 2, description: "Estructura espectacular junto al World Trade Center. Vale la pena verlo por dentro.", seeWhat: ["Arquitectura de Calatrava", "Bóveda blanca"], food: "Muchas opciones cómodas y limpias para comer.", curiosity: "Su diseño arquitectónico busca parecer 'una paloma liberada de las manos de un niño', como símbolo de paz tras los atentados del 11 de septiembre." },
      { id: "911-memorial", name: "9/11 Memorial", category: "monumento", lat: 40.711522, lng: -74.013396, order: 3, description: "El memorial exterior transmite mucho y es menos exigente que el museo.", seeWhat: ["Estanques memoriales", "Survivor Tree"], curiosity: "Las cascadas de los estanques conmemorativos son las fuentes artificiales más grandes de toda Norteamérica. Los nombres perforados se calientan en invierno para que no se congelen." },
      { id: "911-museum", name: "Museo 9/11", category: "museo", lat: 40.711330, lng: -74.012437, order: 4, description: "Solo si os apetece profundizar en la historia del 11-S.", curiosity: "Contiene 'La Escalera de los Sobrevivientes', una escalera original de hormigón por la que cientos de personas lograron escapar el día de los atentados." },
      { id: "trinity-church", name: "Trinity Church", category: "iglesia", lat: 40.708124, lng: -74.012212, order: 5, description: "Iglesia histórica con su cementerio en pleno distrito financiero.", seeWhat: ["Cementerio histórico", "Arquitectura gótica"], curiosity: "Aquí está enterrado Alexander Hamilton, uno de los padres fundadores de EE.UU. Su tumba es una de las más visitadas tras el éxito del famoso musical de Broadway." },
      { id: "wall-street", name: "Wall Street", category: "atraccion", lat: 40.706877, lng: -74.008896, order: 6, description: "El corazón del distrito financiero.", curiosity: "Su nombre proviene literalmente de un muro (wall) de madera que los colonos holandeses construyeron en 1653 para defender la ciudad de ataques británicos e indígenas." },
      { id: "federal-hall", name: "Federal Hall", category: "monumento", lat: 40.707428, lng: -74.010201, order: 7, description: "Edificio histórico con la estatua de George Washington.", curiosity: "Justo en este lugar, George Washington prestó juramento como el primer presidente de los Estados Unidos en 1789." },
      { id: "nyse", name: "Bolsa de Nueva York", category: "monumento", lat: 40.706913, lng: -74.011322, order: 8, description: "La fachada de la New York Stock Exchange.", curiosity: "Debajo del edificio de la Bolsa de Nueva York hay una bóveda gigante que durante muchos años guardó millones de dólares en lingotes de oro de inversores." },
      { id: "charging-bull", name: "Charging Bull", category: "monumento", lat: 40.705573, lng: -74.013420, order: 9, description: "El toro de bronce, icono del distrito financiero.", curiosity: "El escultor instaló este toro de bronce ilegalmente en medio de la noche de 1989 como un 'regalo' a la ciudad. Gustó tanto que el gobierno decidió dejarlo." },
      { id: "stone-street", name: "Stone Street", category: "restaurante", lat: 40.704224, lng: -74.011322, order: 10, description: "Calle histórica con terrazas y ambiente agradable para comer sin desvíos.", food: "La mejor opción para algo con ambiente de sobremesa.", curiosity: "Fue la primera calle pavimentada con piedra (adoquines) de todo Nueva York en 1658, debido a que los vecinos se quejaban del barro constante." },
      { id: "battery-park", name: "Battery Park", category: "parque", lat: 40.703277, lng: -74.017028, order: 11, description: "Cierre junto al agua con vistas a la Estatua de la Libertad.", seeWhat: ["Vistas de la Estatua de la Libertad", "Paseo marítimo"], curiosity: "Su nombre viene de las 'baterías' (batery) de cañones que se instalaron aquí en el siglo XVII para defender el puerto de la ciudad." },
      { id: "battery-park-city", name: "Battery Park City", category: "barrio", lat: 40.711500, lng: -74.016000, order: 12, description: "Zona tranquila junto al río para un café o helado al final.", food: "Café o helado tranquilo.", curiosity: "Este barrio no existía de forma natural; fue construido con la tierra y los escombros extraídos al excavar los cimientos de las Torres Gemelas originales." },
    ],
  },
  {
    id: "day-3",
    number: 3,
    title: "Staten Island Ferry",
    subtitle: "Battery Park y Bowling Green",
    color: "#eab308",
    description:
      "De los tours más agradecidos para un grupo familiar: da sensación de hacer mucho con poco esfuerzo. El ferry es gratuito y ofrece una de las mejores vistas de la Estatua de la Libertad.",
    pace: "Funciona especialmente bien como día suave entre dos días de mucha caminata.",
    places: [
      { id: "bowling-green", name: "Bowling Green", category: "parque", lat: 40.704708, lng: -74.013844, order: 1, description: "Parada de metro y pequeño parque histórico, punto de inicio del recorrido.", curiosity: "Es el parque público más antiguo de Nueva York. La leyenda dice que aquí los holandeses 'compraron' la isla de Manhattan a los nativos por bienes valorados en 24 dólares." },
      { id: "si-ferry", name: "Staten Island Ferry", category: "ferry", lat: 40.701231, lng: -74.013403, order: 2, description: "Sentaos en la parte exterior si hace buen tiempo, en el lado de Manhattan/Liberty Island.", seeWhat: ["Vistas de la Estatua de la Libertad", "Skyline alejándose"], food: "Algo ligero en Lower Manhattan antes de embarcar.", curiosity: "El ferry es gratuito desde 1997. Antes de eso, costaba 50 centavos, y aunque parezca poco, la medida de hacerlo gratis buscaba aliviar el tráfico de coches hacia Manhattan." },
      { id: "st-george", name: "St. George Terminal", category: "ferry", lat: 40.643748, lng: -74.073463, order: 3, description: "Bajada en Staten Island: paseo corto, baños y regreso sin complicarse.", food: "Snack breve y baño.", curiosity: "La terminal de St. George en Staten Island tiene peceras gigantes en su sala de espera, financiadas para hacer la espera del ferry más relajante." },
      { id: "empire-outlets-si", name: "Empire Outlets", category: "compras", lat: 40.643300, lng: -74.073800, order: 4, description: "Outlet justo al lado de St. George, fácil de combinar con el ferry.", curiosity: "Es el primer y único outlet de gran formato construido dentro de los cinco distritos de la ciudad de Nueva York." },
    ],
  },
  {
    id: "day-4",
    number: 4,
    title: "Brooklyn + DUMBO",
    subtitle: "Puente, Chinatown y Little Italy",
    color: "#84cc16",
    description:
      "Uno de los días más fotogénicos y variados. La clave es el orden correcto para evitar repetir puente y llegar a comer con calma.",
    pace: "Si hace mucho calor, mejor hacer el puente temprano y dejar Chinatown/Little Italy para después de comer.",
    places: [
      { id: "brooklyn-bridge", name: "Puente de Brooklyn", category: "monumento", lat: 40.706086, lng: -73.996864, order: 1, description: "Cruzar andando sin prisa: lo bonito es parar, mirar y hacer fotos.", seeWhat: ["Skyline de Manhattan", "Arcos de piedra"], curiosity: "Fue el puente colgante más largo del mundo al inaugurarse. Para demostrar que era seguro, el famoso showman P.T. Barnum lo cruzó con 21 elefantes en 1884." },
      { id: "dumbo", name: "DUMBO", category: "barrio", lat: 40.703277, lng: -73.990322, order: 5, description: "Ver Washington Street, el skyline y el paseo junto al agua.", seeWhat: ["Manhattan Bridge enmarcado", "Paseo del río"], food: "Pizza clásica con vistas.", curiosity: "El nombre DUMBO es un acrónimo de 'Down Under the Manhattan Bridge Overpass' (Debajo del paso elevado del Puente de Manhattan)." },
      { id: "washington-st", name: "Washington Street", category: "atraccion", lat: 40.703605, lng: -73.989000, order: 4, description: "La calle más fotografiada de DUMBO, con el Manhattan Bridge al fondo.", curiosity: "Ese icónico punto de foto es tan famoso que si prestas atención, el arco de la torre del Manhattan Bridge enmarca exactamente al Empire State Building a lo lejos." },
      { id: "pebble-beach", name: "Pebble Beach (Brooklyn Bridge Park)", category: "parque", lat: 40.703600, lng: -73.995600, order: 2, description: "Pequeña playa de guijarros con vistas al puente y al skyline.", curiosity: "Aunque parece natural, estas pequeñas playas en el Brooklyn Bridge Park fueron creadas artificialmente usando rocas sobrantes de excavaciones de túneles." },
      { id: "janes-carousel", name: "Jane's Carousel", category: "atraccion", lat: 40.702700, lng: -73.993400, order: 3, description: "Carrusel histórico junto al río, bonito al menos por fuera.", curiosity: "Este carrusel antiguo fue construido en 1922 en Ohio, y tardaron 27 años en restaurarlo meticulosamente a mano antes de instalarlo en Brooklyn." },
      { id: "chinatown", name: "Chinatown", category: "barrio", lat: 40.715800, lng: -73.997000, order: 6, description: "Funciona mejor como paseo corto + comida que como visita larga.", food: "Dumplings, noodles o dim sum, pica-pica económico.", curiosity: "Es el enclave chino más grande del hemisferio occidental, y muchas de sus calles siguen el trazado original de la época colonial, sin cuadrícula." },
      { id: "little-italy", name: "Little Italy", category: "barrio", lat: 40.719100, lng: -73.997300, order: 7, description: "Ambiente italiano clásico para un paseo corto.", food: "Pasta, cannoli o café tranquilo.", curiosity: "Aunque históricamente llegó a ocupar más de 30 manzanas, hoy en día se ha reducido a apenas un par de calles (principalmente Mulberry Street) debido a la expansión de Chinatown." },
      { id: "soho", name: "SoHo", category: "compras", lat: 40.723301, lng: -74.003000, order: 9, description: "Fachadas de hierro colado, tiendas bonitas y ambiente descansado para los mayores.", curiosity: "Las siglas SoHo significan 'South of Houston'. Conserva la mayor colección de arquitectura de hierro fundido (Cast Iron) del mundo; unas 250 fachadas que se hacían por catálogo." },
      { id: "nolita", name: "Nolita", category: "barrio", lat: 40.722200, lng: -73.995400, order: 8, description: "Zona agradable para pasear y comprar, más tranquila que Canal Street.", curiosity: "Su nombre significa 'North of Little Italy' (Norte de Little Italy). Hace años era zona de pandillas, y hoy es uno de los barrios más cotizados de boutiques." },
    ],
  },
  {
    id: "day-5",
    number: 5,
    title: "Central Park",
    subtitle: "Relajado, zoo y toque de series",
    color: "#22c55e",
    description:
      "Este día debe sentirse como descanso activo. Central Park es enorme: conviene escoger bien el tramo y no intentar verlo todo.",
    pace: "No mezclar con demasiados museos o miradores. Su función es bajar revoluciones.",
    places: [
      { id: "the-pond", name: "The Pond", category: "parque", lat: 40.766500, lng: -73.974000, order: 1, description: "Entrada por la zona sur del parque, cerca de 5th Avenue.", curiosity: "Este estanque es famoso porque en invierno es el hogar favorito de los patos y, en la novela 'El guardián entre el centeno', el protagonista se obsesiona preguntándose a dónde van cuando se congela." },
      { id: "bethesda-terrace", name: "Bethesda Terrace", category: "atraccion", lat: 40.774000, lng: -73.970900, order: 4, description: "Una de las zonas más bellas del parque, con su fuente y arcadas.", curiosity: "La estatua central, 'El Ángel de las Aguas', fue diseñada por Emma Stebbins en 1873, convirtiéndose en la primera mujer en recibir un encargo de arte público en Nueva York." },
      { id: "bow-bridge", name: "Bow Bridge", category: "atraccion", lat: 40.775700, lng: -73.971600, order: 5, description: "El puente romántico más famoso de Central Park.", seeWhat: ["Vistas sobre el lago"], curiosity: "Es el segundo puente de hierro fundido más antiguo de EE.UU. Su diseño es tan romántico que se calcula que ocurren decenas de propuestas de matrimonio aquí cada semana." },
      { id: "strawberry-fields", name: "Strawberry Fields", category: "monumento", lat: 40.775900, lng: -73.975800, order: 6, description: "Memorial a John Lennon con el mosaico Imagine.", curiosity: "Este espacio conmemorativo fue diseñado con el apoyo de Yoko Ono, quien paga por el mantenimiento anual de esta zona. Se plantaron especies vegetales de casi todos los países del mundo." },
      { id: "the-mall", name: "The Mall", category: "parque", lat: 40.771800, lng: -73.971900, order: 3, description: "El paseo arbolado más icónico del parque.", curiosity: "Es el único camino en todo Central Park diseñado para ser perfectamente recto. Fue creado intencionalmente así para que la gente rica de la época pudiera pasear sus carruajes." },
      { id: "central-park-zoo", name: "Central Park Zoo", category: "atraccion", lat: 40.767800, lng: -73.971800, order: 2, description: "Parada ligera y diferente, ideal para el grupo.", curiosity: "Este fue el zoológico que inspiró la película de animación 'Madagascar', aunque en la vida real es muchísimo más pequeño que en la película." },
      { id: "friends-building", name: "Edificio de Friends", category: "atraccion", lat: 40.732100, lng: -74.006100, order: 11, description: "El edificio exterior de la serie Friends en Bedford Street, West Village.", curiosity: "Aunque la serie transcurre en este edificio de NY, 'Friends' nunca grabó una sola escena con actores en esta calle; absolutamente todo se rodó en estudios de California." },
      { id: "friends-experience", name: "Friends Experience", category: "atraccion", lat: 40.741500, lng: -73.989700, order: 9, description: "Experiencia inmersiva para fans de la serie.", curiosity: "Muchos creen que la famosa fuente que sale en la intro de Friends es de Central Park, pero en realidad, la fuente original fue construida en los estudios de Warner Bros en Los Ángeles." },
      { id: "amnh", name: "Museo de Historia Natural", category: "museo", lat: 40.781324, lng: -73.973988, order: 7, description: "Excelente para todas las edades; gusta a casi cualquiera y se camina poco entre salas.", seeWhat: ["Esqueletos de dinosaurios", "Ballena azul", "Planetario"], curiosity: "El museo es tan colosal que posee más de 34 millones de especímenes, plantas y artefactos, pero solo el 2% de esa inmensa colección está en exhibición al público." },
      { id: "upper-west-side", name: "Upper West Side", category: "barrio", lat: 40.787000, lng: -73.975400, order: 8, description: "Cafeterías y restaurantes muy cómodos si salís por el oeste.", food: "Cafeterías y restaurantes acogedores.", curiosity: "Aquí se rodó casi por completo el famoso musical 'West Side Story' antes de que derribaran gran parte de las calles viejas para construir el Lincoln Center." },
      { id: "west-village", name: "West Village", category: "barrio", lat: 40.735800, lng: -74.003600, order: 10, description: "Ambiente encantador si decidís terminar con Friends.", curiosity: "A diferencia del resto de Manhattan, sus calles no siguen una cuadrícula. ¡Tienen ángulos tan caóticos que la calle 4 y la calle 10 llegan a cruzarse entre sí!" },
    ],
  },
  {
    id: "day-6",
    number: 6,
    title: "Roosevelt Island",
    subtitle: "Teleférico y Upper East Side",
    color: "#14b8a6",
    description:
      "Puede quedar muy bonito y descansado. El teleférico ofrece vistas estupendas del East River y es una experiencia corta y diferente.",
    pace: "Ideal como día corto, para volver antes a Stamford o ver partido después.",
    places: [
      { id: "roosevelt-tram", name: "Roosevelt Island Tramway", category: "atraccion", lat: 40.761400, lng: -73.963900, order: 1, description: "Subid al teleférico en 59th Street / 2nd Avenue.", seeWhat: ["Vistas del East River", "Puente de Queensboro"], curiosity: "El viaje dura solo 3 minutos. Cada cabina puede llevar hasta a 110 personas y llega a elevarse casi 80 metros sobre el nivel del East River." },
      { id: "roosevelt-island", name: "Roosevelt Island", category: "barrio", lat: 40.761500, lng: -73.950500, order: 2, description: "Pasear sin prisa; lo mejor es el ambiente y la sensación de salir del Manhattan clásico.", curiosity: "Antes de ser residencial, la isla se llamaba 'Isla del Bienestar' y albergaba exclusivamente asilos, hospitales de cuarentena y una prisión penitenciaria." },
      { id: "southpoint-park", name: "Southpoint Park", category: "parque", lat: 40.748900, lng: -73.957300, order: 3, description: "Paseo más largo con vistas abiertas al sur de la isla.", curiosity: "La colina en el sur del parque fue creada de manera sostenible utilizando los escombros generados durante la excavación del túnel de trenes de la isla." },
      { id: "smallpox-hospital", name: "Smallpox Hospital", category: "monumento", lat: 40.748000, lng: -73.958000, order: 4, description: "Ruinas históricas con un encanto especial al atardecer.", curiosity: "Fue el primer gran hospital de EE.UU. dedicado exclusivamente a pacientes de viruela en el siglo XIX. Hoy es la única 'ruina histórica' oficial catalogada de Nueva York." },
      { id: "bloomingdales", name: "Bloomingdale's", category: "compras", lat: 40.762100, lng: -73.967600, order: 5, description: "Compras suaves al regresar a Manhattan.", curiosity: "Fueron pioneros en el marketing inventando la famosa 'Brown Bag' (bolsa marrón) en 1973, convirtiendo una simple bolsa de compras en un icono de moda mundial." },
      { id: "upper-east-side", name: "Upper East Side", category: "barrio", lat: 40.773600, lng: -73.956600, order: 6, description: "Barrio elegante para café o comida ligera.", food: "Brunch o comida temprana muy cómoda.", curiosity: "Es el barrio que concentra la mayor cantidad de millonarios y coleccionistas de arte por metro cuadrado de toda la ciudad, y escenario de series como Gossip Girl." },
    ],
  },
  {
    id: "day-7",
    number: 7,
    title: "Museos",
    subtitle: "The Met o MoMA, no los dos a fondo",
    color: "#06b6d4",
    description:
      "Elegir un museo protagonista por día y, si queda energía, añadir otro muy breve o solo el exterior.",
    pace: "Este tour debe ser cultural y contenido, no una acumulación de entradas.",
    places: [
      { id: "the-met", name: "The Met", category: "museo", lat: 40.779437, lng: -73.963244, order: 1, description: "Uno de los grandes imprescindibles: un gran museo con piezas muy reconocibles y visita elegante. Sobre la Museum Mile.", seeWhat: ["Templo de Dendur", "Galerías europeas", "Terraza con vistas"], food: "Cafetería dentro o almuerzo cerca.", curiosity: "Dentro del Met se encuentra el Templo de Dendur, un templo egipcio real del año 15 a.C. regalado a EE.UU. para evitar que quedara hundido por la presa de Asuán en el Nilo." },
      { id: "moma", name: "MoMA", category: "museo", lat: 40.761436, lng: -73.977621, order: 4, description: "Encaja con un día de Midtown, muy cerca de Rockefeller y 5th Avenue. Haced selección interna.", seeWhat: ["La noche estrellada", "Las señoritas de Aviñón"], curiosity: "El MoMA fue el primer museo del mundo en incluir 'Videojuegos' (como Pac-Man o Tetris) dentro de su colección permanente de arte y diseño." },
      { id: "guggenheim", name: "Guggenheim", category: "museo", lat: 40.782999, lng: -73.958957, order: 3, description: "Merece la pena fijarse en su exterior aunque no entréis.", seeWhat: ["Espiral de Frank Lloyd Wright"], curiosity: "Frank Lloyd Wright diseñó la famosa espiral blanca del museo para que la gente subiera en ascensor y luego fuera bajando la rampa suavemente viendo los cuadros sin cansarse." },
      { id: "museum-mile", name: "Museum Mile", category: "atraccion", lat: 40.780000, lng: -73.959000, order: 2, description: "Paseo por la 5th Avenue cultural, junto a Central Park.", curiosity: "Esta 'milla' tiene una concentración tan ridículamente alta de cultura que, una vez al año, cortan la calle entera al tráfico para hacer un festival de museos gratis." },
    ],
  },
  {
    id: "day-8",
    number: 8,
    title: "High Line + Chelsea",
    subtitle: "Chelsea Market, Little Island y Hudson Yards",
    color: "#3b82f6",
    description:
      "Una de las zonas más agradables y actuales de Manhattan. Combina muy bien paseo, comida y miradores sin la locura de Midtown.",
    pace: "Muy bueno para adultos porque es modular: solo Chelsea + High Line, o todo con Edge si estáis fuertes.",
    places: [
      { id: "chelsea-market", name: "Chelsea Market", category: "restaurante", lat: 40.742400, lng: -74.006100, order: 2, description: "Perfecto para desayunar tarde o comer pronto.", seeWhat: ["Mercado gastronómico", "Puestos artesanales"], food: "Donde mejor funciona el tour: comer bien sin restaurante formal.", curiosity: "Este edificio era la fábrica original de Nabisco. Exactamente en este lugar es donde se inventaron, hornearon y probaron las primeras galletas Oreo en 1912." },
      { id: "high-line", name: "High Line", category: "parque", lat: 40.748000, lng: -74.004800, order: 3, description: "Paseo elevado de unos 3 km con otra perspectiva de la ciudad.", seeWhat: ["Jardines elevados", "Vistas del Hudson"], curiosity: "Antes de ser parque, fue una vía de tren de carga muy peligrosa que pasaba a nivel de calle. La elevaron en los años 30 para evitar accidentes mortales." },
      { id: "little-island", name: "Little Island", category: "parque", lat: 40.742000, lng: -74.011000, order: 1, description: "Parque muy fotogénico y agradable junto al río Hudson. Bonito, gratis y descansado.", food: "Helado o café junto al río.", curiosity: "Este parque flotante se sostiene sobre 132 columnas con forma de tulipán que varían en altura. En el fondo, parece una hoja flotando en el agua." },
      { id: "hudson-yards", name: "Hudson Yards", category: "atraccion", lat: 40.753900, lng: -74.002100, order: 4, description: "Zona moderna con tiendas y restaurantes.", curiosity: "Es el mayor desarrollo inmobiliario privado en la historia de los Estados Unidos. Literalmente, construyeron una plataforma gigante sobre unas vías de tren operativas para hacer estos rascacielos." },
      { id: "vessel", name: "Vessel", category: "atraccion", lat: 40.753800, lng: -74.001900, order: 5, description: "Estructura escultórica icónica; ver el exterior.", curiosity: "Toda la estructura costó 200 millones de dólares y las piezas fueron fabricadas en Italia, metidas en barcos y montadas en Nueva York como un puzzle gigante." },
      { id: "edge", name: "Edge", category: "mirador", lat: 40.753600, lng: -74.001700, order: 6, description: "Mirador grande del día, ideal al atardecer.", seeWhat: ["Suelo de cristal", "Vistas 360º"], food: "Cena temprana en Hudson Yards si subís al atardecer.", curiosity: "Es el mirador al aire libre más alto del hemisferio occidental. Su cristal no es completamente recto: está inclinado hacia afuera para que parezca que flotas sobre el abismo." },
    ],
  },
  {
    id: "day-9",
    number: 9,
    title: "Harlem",
    subtitle: "Misa góspel y comida soul",
    color: "#8b5cf6",
    description:
      "Una Nueva York distinta, menos de postal y más de barrio con identidad. Si os interesa, mejor en domingo para la misa góspel.",
    pace: "Muy recomendable, pero solo si os atrae de verdad la parte cultural y no vais con prisa por tachar sitios.",
    places: [
      { id: "harlem", name: "Harlem", category: "barrio", lat: 40.811600, lng: -73.946500, order: 2, description: "Subir por la mañana en metro y pasear por sus calles clásicas.", seeWhat: ["Brownstones", "Arquitectura residencial"], curiosity: "Durante la Prohibición (los años 20), Harlem tenía cientos de clubes clandestinos, como el famoso Cotton Club, donde actuaban leyendas del jazz mientras que el alcohol fluía en secreto." },
      { id: "gospel-church", name: "Misa góspel (Abyssinian Baptist)", category: "iglesia", lat: 40.815800, lng: -73.941200, order: 1, description: "Asistir respetando que es un acto religioso y no solo un espectáculo turístico.", curiosity: "La música góspel tiene raíces tan profundas que muchos de sus himnos tradicionales ocultaban mensajes secretos y mapas cantados para guiar a los esclavos prófugos hacia la libertad." },
      { id: "soul-food", name: "Soul food (Sylvia's)", category: "restaurante", lat: 40.808600, lng: -73.944400, order: 4, description: "Comer soul food en un sitio histórico es parte fundamental de la experiencia.", food: "Soul food: aquí la comida forma parte del plan.", curiosity: "El concepto de 'Soul Food' se originó a partir de las limitadas raciones alimenticias que recibían los esclavos afroamericanos, quienes, con creatividad, transformaron ingredientes humildes en alta gastronomía." },
      { id: "apollo-theater", name: "Apollo Theater", category: "atraccion", lat: 40.809900, lng: -73.950100, order: 3, description: "Pasar por fuera del mítico teatro de Harlem.", curiosity: "La noche amateur (Amateur Night) del Apollo lanzó a la fama a artistas legendarios de la talla de Ella Fitzgerald, James Brown, Michael Jackson y Lauryn Hill." },
    ],
  },
  {
    id: "day-10",
    number: 10,
    title: "Compras",
    subtitle: "Opciones realistas con transporte público",
    color: "#ec4899",
    description:
      "Separar tres categorías: compras urbanas en Manhattan, outlet fácil y outlet grande pero cansado. Así evitáis trayectos larguísimos.",
    pace: "Para padres mayores, lo mejor suele ser Manhattan + SoHo o Empire Outlets. Jersey Gardens sería la opción intermedia.",
    places: [
      { id: "herald-square", name: "Herald Square", category: "compras", lat: 40.750500, lng: -73.987900, order: 1, description: "Centro comercial urbano en pleno Midtown.", curiosity: "La plaza lleva el nombre de un periódico extinto (el New York Herald). Su reloj central cuenta con búhos mecánicos con ojos que brillan intermitentemente." },
      { id: "macys", name: "Macy's", category: "compras", lat: 40.751000, lng: -73.988800, order: 2, description: "Los grandes almacenes más famosos de Nueva York.", curiosity: "Macy's de Herald Square fue durante décadas la tienda más grande del mundo. Todavía conserva algunas de sus escaleras mecánicas originales hechas totalmente de madera." },
      { id: "century-21", name: "Century 21", category: "compras", lat: 40.710000, lng: -74.011000, order: 3, description: "Descuentos en moda cerca del distrito financiero.", curiosity: "Después de los atentados del 11 de septiembre, Century 21 sufrió graves daños estructurales. Su reapertura cinco meses después fue un poderoso símbolo de resiliencia para el Distrito Financiero." },
      { id: "jersey-gardens", name: "Jersey Gardens", category: "compras", lat: 40.664000, lng: -74.169000, order: 4, description: "Clásico de compras accesible en transporte público/bus desde la ciudad.", curiosity: "Dado que está ubicado en el estado de Nueva Jersey, la ropa y el calzado están libres de impuestos sobre las ventas (tax-free), ahorrando mucho dinero en grandes compras." },
      { id: "woodbury-common", name: "Woodbury Common", category: "compras", lat: 41.334000, lng: -74.118000, order: 5, description: "El outlet más famoso y fuerte en marcas, pero el que más castiga por distancia.", curiosity: "El recinto de Woodbury Common es tan extenso y tiene tantas calles que dispone de su propia red interna de autobuses para llevar a la gente de un extremo a otro." },
    ],
  },
  {
    id: "day-11",
    number: 11,
    title: "Stamford",
    subtitle: "Playa, casa, piscina y respiro",
    color: "#64748b",
    description:
      "No es relleno: es esencial para que Nueva York no os pase factura. Evitad el error de intentar hacer Manhattan todos los días.",
    pace: "Los itinerarios largos funcionan mejor con días domésticos y sencillos.",
    places: [
      { id: "stamford-station", name: "Stamford Train Station", category: "estacion", lat: 41.046900, lng: -73.542000, order: 1, description: "Base del viaje. El tren a Grand Central tarda unos 55–60 minutos.", seeWhat: ["Metro-North New Haven Line"], curiosity: "Es la estación más concurrida de la red ferroviaria Metro-North fuera de la ciudad de Nueva York. Conecta la tranquilidad de Connecticut con la locura de Manhattan en solo una hora." },
      { id: "stamford-downtown", name: "Stamford", category: "barrio", lat: 41.053400, lng: -73.538700, order: 2, description: "Mañana lenta, paseo local y comida en casa.", curiosity: "Conocida históricamente como la 'Ciudad de las Cerraduras', Stamford albergaba a la compañía Yale & Towne, que llegó a fabricar candados y cerraduras para todo el mundo." },
      { id: "cove-island", name: "Cove Island Park", category: "parque", lat: 41.042000, lng: -73.518000, order: 3, description: "Playa cercana y paseo local para un día tranquilo.", curiosity: "El parque cuenta con un sendero ecológico y un santuario de aves que es hogar y punto de descanso para decenas de especies durante sus migraciones anuales en primavera." },
    ],
  },
  {
    id: "day-12",
    number: 12,
    title: "Niagara Falls",
    subtitle: "Excursión económica en bus",
    color: "#0ea5e9",
    description:
      "Niágara en bus nocturno y volver el mismo día es una paliza, pero reduce gasto. Concentrarse en el lado estadounidense, miradores gratuitos.",
    pace: "No colocar pegado a un día fuerte de Manhattan. Mejor con un día de descanso antes o después.",
    places: [
      { id: "niagara-park", name: "Niagara Falls State Park", category: "parque", lat: 43.082800, lng: -79.065300, order: 1, description: "El acceso a miradores y zona exterior es gratuito. Se pagan atracciones concretas.", seeWhat: ["Miradores exteriores", "Observation Tower"], curiosity: "Es el parque estatal más antiguo de todos los Estados Unidos. Fue fundado en 1885 para proteger las cataratas de la explotación comercial masiva y la industrialización." },
      { id: "american-falls", name: "American Falls", category: "atraccion", lat: 43.084000, lng: -79.068600, order: 2, description: "Las cataratas del lado estadounidense, perfectas para fotos.", curiosity: "Solo el 10% del caudal total del río Niágara pasa por el lado estadounidense (American Falls); el 90% restante cae por la herradura canadiense." },
      { id: "bridal-veil", name: "Bridal Veil Falls", category: "atraccion", lat: 43.079600, lng: -79.069900, order: 3, description: "La más pequeña de las tres cataratas, junto a Luna Island.", curiosity: "La fuerza del viento generado por el choque del agua en Bridal Veil Falls es tan brutal que puede levantar fuertes corrientes de aire verticales capaces de arrancarte el sombrero de la cabeza." },
      { id: "horseshoe-falls", name: "Horseshoe Falls", category: "atraccion", lat: 43.077900, lng: -79.074700, order: 4, description: "Las cataratas en forma de herradura, las más impresionantes vistas desde lejos.", curiosity: "El volumen de agua que cae por Horseshoe Falls es tan inmenso (miles de toneladas por segundo) que la enorme vibración sísmica hace temblar la tierra alrededor de los miradores." },
    ],
  },
];

export const allPlaces: (Place & { dayId: string; dayTitle: string; dayColor: string })[] =
  days.flatMap((d) =>
    d.places.map((p) => ({ ...p, dayId: d.id, dayTitle: `Día ${d.number}: ${d.title}`, dayColor: d.color })),
  );
