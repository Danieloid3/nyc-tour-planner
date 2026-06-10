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
      "El objetivo de hoy es sumergirse en la magia clásica de Nueva York. Pasearán por el corazón de Manhattan, maravillándose con sus rascacielos más emblemáticos, la Quinta Avenida y las luces de Times Square.",
    pace: "Este día incluye mucho asfalto. Tómense su tiempo en Bryant Park para descansar las piernas antes de seguir hacia la Quinta Avenida.",
    places: [
      { id: "grand-central", name: "Grand Central Terminal", category: "estacion", lat: 40.752726, lng: -73.977229, order: 1, description: "Una maravilla arquitectónica que sirve como el principal punto de encuentro de la ciudad. Su fachada y vestíbulo son impresionantes.", seeWhat: ["Gran vestíbulo", "Techo astronómico", "Vanderbilt Hall"], food: "Para desayunar o tomar un café rápido, visiten el mercado de comidas en la planta baja. 'Magnolia Bakery' tiene postres deliciosos y famosos.", curiosity: "El techo estrellado del vestíbulo principal está pintado al revés. Cornelius Vanderbilt afirmó que era a propósito para verlo 'desde la perspectiva de Dios'." },
      { id: "summit-ovt", name: "SUMMIT One Vanderbilt", category: "mirador", lat: 40.752854, lng: -73.978674, order: 2, description: "Una experiencia inmersiva y sensorial con espejos y cristal, ofreciendo vistas espectaculares del Empire State y la ciudad.", seeWhat: ["Skyline de Midtown", "Experiencia de espejos"], curiosity: "Los espejos del Summit One Vanderbilt cubren más de 2,700 metros cuadrados, creando una ilusión de espacio infinito que te hace perder la noción de dónde estás." },
      { id: "nypl", name: "Biblioteca Pública de Nueva York", category: "monumento", lat: 40.753182, lng: -73.982253, order: 3, description: "Un palacio del saber resguardado por los famosos leones de piedra. Su sala de lectura principal es un remanso de paz majestuoso.", seeWhat: ["Rose Main Reading Room", "Leones de mármol"], curiosity: "Los famosos leones de mármol de la entrada se llamaban originalmente Leo Astor y Leo Lenox, pero en la Gran Depresión fueron rebautizados como 'Paciencia' y 'Fortaleza'." },
      { id: "bryant-park", name: "Bryant Park", category: "parque", lat: 40.753596, lng: -73.983233, order: 4, description: "Un precioso parque de estilo francés en medio de los rascacielos. Perfecto para sentarse a tomar un café y observar el ritmo de la ciudad.", food: "Perfecto para un sándwich en 'Le Pain Quotidien' o probar los wafles dulces de 'Wafels & Dinges' junto al parque.", curiosity: "Debajo del césped de este parque hay dos pisos enteros llenos de libros almacenados que pertenecen a la Biblioteca Pública de Nueva York." },
      { id: "fifth-avenue", name: "5th Avenue", category: "compras", lat: 40.7607, lng: -73.9748, order: 5, description: "La calle comercial más famosa del mundo. Aquí encontrarán tiendas de lujo, banderas ondeando y una arquitectura deslumbrante.", curiosity: "Esta avenida es la línea divisoria oficial entre el 'East Side' y el 'West Side' de Manhattan. Aquí es donde los números de las calles cambian de Este a Oeste." },
      { id: "st-patrick", name: "Catedral de St. Patrick", category: "iglesia", lat: 40.758465, lng: -73.975993, order: 6, description: "Una obra maestra del estilo neogótico que contrasta de forma espectacular con los enormes y modernos rascacielos que la rodean.", seeWhat: ["Fachada neogótica", "Vidrieras"], curiosity: "Tardaron 21 años en construirla, interrumpiendo las obras por la Guerra Civil. Hoy sus agujas parecen pequeñas, pero en 1878 era el edificio más alto de NY." },
      { id: "rockefeller", name: "Rockefeller Center", category: "atraccion", lat: 40.758740, lng: -73.978674, order: 7, description: "Un histórico complejo Art Déco lleno de vida. Es famoso por su pista de patinaje, sus estatuas doradas y sus jardines hundidos.", curiosity: "En invierno, su famoso árbol de Navidad consume más de 50.000 luces LED, y cuando se retira, la madera se dona para construir casas para los más necesitados." },
      { id: "top-of-the-rock", name: "Top of the Rock", category: "mirador", lat: 40.759306, lng: -73.978969, order: 8, description: "Un mirador clásico al aire libre con la ventaja de tener la mejor vista directa hacia Central Park y el icónico Empire State.", seeWhat: ["Vista del Empire State", "Central Park desde el aire"], curiosity: "Fue diseñado originalmente para parecerse a la cubierta de un lujoso transatlántico, por eso verás detalles náuticos y barandillas que parecen de un barco." },
      { id: "times-square", name: "Times Square", category: "atraccion", lat: 40.758000, lng: -73.985500, order: 9, description: "El deslumbrante cruce de neones y pantallas gigantes. Es el corazón palpitante y ruidoso de Nueva York que nunca duerme.", seeWhat: ["Pantallas gigantes", "Broadway"], curiosity: "Originalmente se llamaba Longacre Square. Cambió su nombre en 1904 cuando el periódico The New York Times mudó allí su sede central." },
      { id: "koreatown", name: "Koreatown", category: "restaurante", lat: 40.747900, lng: -73.986900, order: 10, description: "Un vibrante y bullicioso pequeño barrio asiático repleto de letreros luminosos, restaurantes auténticos y mucha cultura culinaria.", food: "Anímense a probar un restaurante clásico y cómodo como 'Jongro BBQ' o disfrutar un postre suave en la panadería 'Paris Baguette'.", curiosity: "Aunque ocupa apenas una cuadra (la calle 32), la mayoría de los restaurantes coreanos aquí son auténticos rascacielos 'verticales' con negocios hasta en los pisos más altos." },
      { id: "empire-state", name: "Empire State Building", category: "mirador", lat: 40.748417, lng: -73.985738, order: 11, description: "El rascacielos más famoso del mundo. Su silueta define el horizonte de Nueva York y subirlo es un viaje a la época dorada de la ciudad.", seeWhat: ["Fachada Art Déco", "Mirador opcional"], curiosity: "Tiene su propio código postal (10118) y sus luces LED superiores pueden mostrar más de 16 millones de combinaciones de colores distintas." },
      { id: "msg", name: "Madison Square Garden", category: "atraccion", lat: 40.750504, lng: -73.993439, order: 12, description: "El mítico 'Madison Square Garden', una de las arenas deportivas y de entretenimiento más importantes de la historia mundial.", curiosity: "Es el estadio en activo más antiguo de la NBA y de la NHL, pero curiosamente no está sobre suelo firme, ¡sino que fue construido justo encima de la estación de tren Penn Station!" },
    ],
  },
  {
    id: "day-2",
    number: 2,
    title: "Lower Manhattan",
    subtitle: "9/11, Oculus y distrito financiero",
    color: "#f97316",
    description:
      "Hoy viajarán a los orígenes de la ciudad. El objetivo es explorar el Distrito Financiero, caminar entre calles históricas y presentar sus respetos en el imponente y emotivo Memorial del 11 de Septiembre.",
    pace: "Día con mucha historia y muy plano. Si sienten cansancio, pueden omitir el interior del museo y disfrutar solo de las vistas exteriores y Wall Street.",
    places: [
      { id: "fulton-st", name: "Fulton Street", category: "estacion", lat: 40.709913, lng: -74.007846, order: 1, description: "Un moderno y gigantesco centro de transporte con un espectacular óculo en su techo que deja entrar la luz natural hasta los andenes.", curiosity: "La estación de metro Fulton Center tiene un tragaluz gigante llamado 'Sky Reflector-Net' compuesto por 952 paneles de aluminio que bajan la luz solar hasta las vías." },
      { id: "oculus", name: "Oculus", category: "atraccion", lat: 40.711522, lng: -74.011080, order: 2, description: "Una estación y centro comercial con un diseño futurista impresionante. Su arquitectura blanca resplandece en el centro financiero.", seeWhat: ["Arquitectura de Calatrava", "Bóveda blanca"], food: "Justo al lado está 'Eataly', un inmenso y precioso mercado italiano donde pueden sentarse a comer pasta fresca cómodamente.", curiosity: "Su diseño arquitectónico busca parecer 'una paloma liberada de las manos de un niño', como símbolo de paz tras los atentados del 11 de septiembre." },
      { id: "911-memorial", name: "9/11 Memorial", category: "monumento", lat: 40.711522, lng: -74.013396, order: 3, description: "Un lugar solemne y hermoso donde antes se alzaban las Torres Gemelas. Las dos inmensas fuentes invitan al silencio y la reflexión.", seeWhat: ["Estanques memoriales", "Survivor Tree"], curiosity: "Las cascadas de los estanques conmemorativos son las fuentes artificiales más grandes de toda Norteamérica. Los nombres perforados se calientan en invierno para que no se congelen." },
      { id: "911-museum", name: "Museo 9/11", category: "museo", lat: 40.711330, lng: -74.012437, order: 4, description: "Un recorrido profundamente conmovedor y respetuoso por los eventos del 11 de septiembre, preservando la memoria histórica de la ciudad.", curiosity: "Contiene 'La Escalera de los Sobrevivientes', una escalera original de hormigón por la que cientos de personas lograron escapar el día de los atentados." },
      { id: "trinity-church", name: "Trinity Church", category: "iglesia", lat: 40.708124, lng: -74.012212, order: 5, description: "Una histórica iglesia de piedra oscura que alguna vez fue el edificio más alto de la ciudad. Su cementerio alberga próceres de la nación.", seeWhat: ["Cementerio histórico", "Arquitectura gótica"], curiosity: "Aquí está enterrado Alexander Hamilton, uno de los padres fundadores de EE.UU. Su tumba es una de las más visitadas tras el éxito del famoso musical de Broadway." },
      { id: "wall-street", name: "Wall Street", category: "atraccion", lat: 40.706877, lng: -74.008896, order: 6, description: "El epicentro financiero del mundo. Caminar por esta estrecha y antigua calle es sentir el peso de la historia y la economía global.", curiosity: "Su nombre proviene literalmente de un muro (wall) de madera que los colonos holandeses construyeron en 1653 para defender la ciudad de ataques británicos e indígenas." },
      { id: "federal-hall", name: "Federal Hall", category: "monumento", lat: 40.707428, lng: -74.010201, order: 7, description: "Un edificio de columnas griegas vital para la historia estadounidense. Aquí nació la nación y George Washington tomó posesión.", curiosity: "Justo en este lugar, George Washington prestó juramento como el primer presidente de los Estados Unidos en 1789." },
      { id: "nyse", name: "Bolsa de Nueva York", category: "monumento", lat: 40.706913, lng: -74.011322, order: 8, description: "La fachada de la Bolsa de Nueva York es un símbolo mundial del capitalismo, adornada con su icónica bandera estadounidense.", curiosity: "Debajo del edificio de la Bolsa de Nueva York hay una bóveda gigante que durante muchos años guardó millones de dólares en lingotes de oro de inversores." },
      { id: "charging-bull", name: "Charging Bull", category: "monumento", lat: 40.705573, lng: -74.013420, order: 9, description: "El famoso y feroz toro de bronce que representa el optimismo financiero. ¡La tradición dice que acariciarlo atrae la buena suerte!", curiosity: "El escultor instaló este toro de bronce ilegalmente en medio de la noche de 1989 como un 'regalo' a la ciudad. Gustó tanto que el gobierno decidió dejarlo." },
      { id: "stone-street", name: "Stone Street", category: "restaurante", lat: 40.704224, lng: -74.011322, order: 10, description: "Una pintoresca y encantadora calle adoquinada de la época colonial, hoy llena de terrazas y tabernas históricas para relajarse.", food: "Una calle empedrada preciosa. 'Adrienne's Pizzabar' es muy recomendado para comer relajados al aire libre y reponer fuerzas.", curiosity: "Fue la primera calle pavimentada con piedra (adoquines) de todo Nueva York en 1658, debido a que los vecinos se quejaban del barro constante." },
      { id: "battery-park", name: "Battery Park", category: "parque", lat: 40.703277, lng: -74.017028, order: 11, description: "Un amplio y arbolado parque frente al mar en la punta sur de Manhattan, ideal para pasear con la brisa marina.", seeWhat: ["Vistas de la Estatua de la Libertad", "Paseo marítimo"], curiosity: "Su nombre viene de las 'baterías' (batery) de cañones que se instalaron aquí en el siglo XVII para defender el puerto de la ciudad." },
      { id: "battery-park-city", name: "Battery Park City", category: "barrio", lat: 40.711500, lng: -74.016000, order: 12, description: "Una tranquila zona residencial junto al agua con precioso paisajismo y senderos ajardinados para escapar del ruido del centro.", food: "Tómense un descanso en 'Hudson Eats', que tiene ventanales enormes con vistas al río, asientos cómodos y comida de todo tipo.", curiosity: "Este barrio no existía de forma natural; fue construido con la tierra y los escombros extraídos al excavar los cimientos de las Torres Gemelas originales." },
    ],
  },
  {
    id: "day-3",
    number: 3,
    title: "Staten Island Ferry",
    subtitle: "Battery Park y Bowling Green",
    color: "#eab308",
    description:
      "Un día marítimo con un objetivo claro: saludar a la Estatua de la Libertad. Disfrutarán de la brisa del puerto y de las mejores vistas panorámicas del sur de Manhattan desde el agua.",
    pace: "Un día muy relajado. El viaje en ferry les permitirá descansar sentados y abrigados mientras disfrutan de la Estatua de la Libertad.",
    places: [
      { id: "bowling-green", name: "Bowling Green", category: "parque", lat: 40.704708, lng: -74.013844, order: 1, description: "El parque público más antiguo de Nueva York, rodeado de impresionantes edificios históricos y mucha tranquilidad matutina.", curiosity: "Es el parque público más antiguo de Nueva York. La leyenda dice que aquí los holandeses 'compraron' la isla de Manhattan a los nativos por bienes valorados en 24 dólares." },
      { id: "si-ferry", name: "Staten Island Ferry", category: "ferry", lat: 40.701231, lng: -74.013403, order: 2, description: "El emblemático barco naranja que cruza la bahía. Ofrece las mejores vistas gratuitas del perfil de Manhattan y la Estatua de la Libertad.", seeWhat: ["Vistas de la Estatua de la Libertad", "Skyline alejándose"], food: "Antes de subir, pueden comprar un pretzel suave o un café caliente en la misma terminal para disfrutar el viaje tranquilamente.", curiosity: "El ferry es gratuito desde 1997. Antes de eso, costaba 50 centavos, y aunque parezca poco, la medida de hacerlo gratis buscaba aliviar el tráfico de coches hacia Manhattan." },
      { id: "st-george", name: "St. George Terminal", category: "ferry", lat: 40.643748, lng: -74.073463, order: 3, description: "El relajado barrio marítimo donde atraca el ferry, ideal para estirar las piernas y disfrutar del paisaje costero.", food: "La terminal tiene asientos y puestitos ideales para usar el baño y tomar un jugo o agua antes de volver al ferry.", curiosity: "La terminal de St. George en Staten Island tiene peceras gigantes en su sala de espera, financiadas para hacer la espera del ferry más relajante." },
      { id: "empire-outlets-si", name: "Empire Outlets", category: "compras", lat: 40.643300, lng: -74.073800, order: 4, description: "El lugar perfecto para disfrutar de tiendas de marca con descuento al aire libre y con vistas inmejorables de la bahía de Nueva York.", curiosity: "Es el primer y único outlet de gran formato construido dentro de los cinco distritos de la ciudad de Nueva York." },
    ],
  },
  {
    id: "day-4",
    number: 4,
    title: "Brooklyn + DUMBO",
    subtitle: "Puente, Chinatown y Little Italy",
    color: "#84cc16",
    description:
      "El reto de hoy es cruzar el legendario Puente de Brooklyn a pie. Después, disfrutarán del encanto de DUMBO y se perderán por las pintorescas y vibrantes calles de Chinatown y SoHo.",
    pace: "Cruzar el puente es precioso pero puede cansar. Háganlo a su ritmo, parando a tomar fotos, y aprovechen el metro para regresar desde DUMBO.",
    places: [
      { id: "brooklyn-bridge", name: "Puente de Brooklyn", category: "monumento", lat: 40.706086, lng: -73.996864, order: 1, description: "Caminar por su pasarela de madera, entre cables de acero y arcos de piedra, es una de las experiencias más inolvidables de Nueva York.", seeWhat: ["Skyline de Manhattan", "Arcos de piedra"], curiosity: "Fue el puente colgante más largo del mundo al inaugurarse. Para demostrar que era seguro, el famoso showman P.T. Barnum lo cruzó con 21 elefantes en 1884." },
      { id: "dumbo", name: "DUMBO", category: "barrio", lat: 40.703277, lng: -73.990322, order: 5, description: "Un barrio industrial transformado en una zona chic, con calles empedradas, galerías de arte y algunas de las mejores vistas del río.", seeWhat: ["Manhattan Bridge enmarcado", "Paseo del río"], food: "¡Tienen que probar 'Juliana's Pizza'! Es pizza al horno de carbón que vale completamente la pena. (Suele haber algo de fila, pero avanza rápido).", curiosity: "El nombre DUMBO es un acrónimo de 'Down Under the Manhattan Bridge Overpass' (Debajo del paso elevado del Puente de Manhattan)." },
      { id: "washington-st", name: "Washington Street", category: "atraccion", lat: 40.703605, lng: -73.989000, order: 4, description: "La foto más icónica de Brooklyn: la majestuosa torre del Manhattan Bridge enmarcada perfectamente por viejos edificios de ladrillo rojo.", curiosity: "Ese icónico punto de foto es tan famoso que si prestas atención, el arco de la torre del Manhattan Bridge enmarca exactamente al Empire State Building a lo lejos." },
      { id: "pebble-beach", name: "Pebble Beach (Brooklyn Bridge Park)", category: "parque", lat: 40.703600, lng: -73.995600, order: 2, description: "Una pequeña playa de rocas a orillas del East River. Es el lugar soñado para sentarse a contemplar el skyline de Manhattan.", curiosity: "Aunque parece natural, estas pequeñas playas en el Brooklyn Bridge Park fueron creadas artificialmente usando rocas sobrantes de excavaciones de túneles." },
      { id: "janes-carousel", name: "Jane's Carousel", category: "atraccion", lat: 40.702700, lng: -73.993400, order: 3, description: "Una preciosa y nostálgica atracción de feria restaurada, encerrada en una caja de cristal junto al agua y el puente.", curiosity: "Este carrusel antiguo fue construido en 1922 en Ohio, y tardaron 27 años en restaurarlo meticulosamente a mano antes de instalarlo en Brooklyn." },
      { id: "chinatown", name: "Chinatown", category: "barrio", lat: 40.715800, lng: -73.997000, order: 6, description: "Un mundo aparte dentro de la ciudad. Sus calles laberínticas rebosan de mercados al aire libre, olores exóticos y letreros en chino.", food: "Para probar comida auténtica y suave, 'Joe's Shanghai' es muy famoso por sus raviolis chinos en sopa. ¡Tengan cuidado al morder que vienen calientes!", curiosity: "Es el enclave chino más grande del hemisferio occidental, y muchas de sus calles siguen el trazado original de la época colonial, sin cuadrícula." },
      { id: "little-italy", name: "Little Italy", category: "barrio", lat: 40.719100, lng: -73.997300, order: 7, description: "Lo que queda del histórico barrio de inmigrantes italianos, hoy famoso por sus alegres restaurantes y el olor a pasta y pizza en la calle.", food: "Pidan un dulce tradicional italiano (cannoli) en la pastelería histórica 'Ferrara Bakery & Cafe'. Tienen mesas amplias para descansar.", curiosity: "Aunque históricamente llegó a ocupar más de 30 manzanas, hoy en día se ha reducido a apenas un par de calles (principalmente Mulberry Street) debido a la expansión de Chinatown." },
      { id: "soho", name: "SoHo", category: "compras", lat: 40.723301, lng: -74.003000, order: 9, description: "Un paraíso arquitectónico. Sus edificios de hierro fundido (Cast Iron) y aceras empedradas albergan tiendas de diseño y moda exclusiva.", curiosity: "Las siglas SoHo significan 'South of Houston'. Conserva la mayor colección de arquitectura de hierro fundido (Cast Iron) del mundo; unas 250 fachadas que se hacían por catálogo." },
      { id: "nolita", name: "Nolita", category: "barrio", lat: 40.722200, lng: -73.995400, order: 8, description: "Un encantador vecindario lleno de callejuelas arboladas, pequeñas boutiques independientes y cafés acogedores de ambiente relajado.", curiosity: "Su nombre significa 'North of Little Italy' (Norte de Little Italy). Hace años era zona de pandillas, y hoy es uno de los barrios más cotizados de boutiques." },
    ],
  },
  {
    id: "day-5",
    number: 5,
    title: "Central Park",
    subtitle: "Relajado, zoo y toque de series",
    color: "#22c55e",
    description:
      "Día de contrastes. Comenzarán respirando aire puro en el inmenso Central Park, visitarán la zona de los museos de historia natural y terminarán paseando por las tranquilas calles residenciales del West Village.",
    pace: "Central Park es inmenso. No intenten caminarlo entero; la idea es dar un paseo tranquilo por el sur y sentarse en las bancas a ver la vida pasar.",
    places: [
      { id: "the-pond", name: "The Pond", category: "parque", lat: 40.766500, lng: -73.974000, order: 1, description: "El estanque sur del parque, un pequeño oasis rodeado de naturaleza con un fuerte contraste visual con los rascacielos.", curiosity: "Este estanque es famoso porque en invierno es el hogar favorito de los patos y, en la novela 'El guardián entre el centeno', el protagonista se obsesiona preguntándose a dónde van cuando se congela." },
      { id: "bethesda-terrace", name: "Bethesda Terrace", category: "atraccion", lat: 40.774000, lng: -73.970900, order: 4, description: "La plaza central del parque, famosa por su inmensa fuente y las increíbles vistas al lago. Siempre llena de artistas y músicos.", curiosity: "La estatua central, 'El Ángel de las Aguas', fue diseñada por Emma Stebbins en 1873, convirtiéndose en la primera mujer en recibir un encargo de arte público en Nueva York." },
      { id: "bow-bridge", name: "Bow Bridge", category: "atraccion", lat: 40.775700, lng: -73.971600, order: 5, description: "El puente más romántico y fotografiado del parque. Su elegante arco de hierro blanco se refleja perfectamente en el agua del lago.", seeWhat: ["Vistas sobre el lago"], curiosity: "Es el segundo puente de hierro fundido más antiguo de EE.UU. Su diseño es tan romántico que se calcula que ocurren decenas de propuestas de matrimonio aquí cada semana." },
      { id: "strawberry-fields", name: "Strawberry Fields", category: "monumento", lat: 40.775900, lng: -73.975800, order: 6, description: "Un apacible rincón en forma de lágrima dedicado a la memoria de John Lennon, decorado con el famoso mosaico 'Imagine'.", curiosity: "Este espacio conmemorativo fue diseñado con el apoyo de Yoko Ono, quien paga por el mantenimiento anual de esta zona. Se plantaron especies vegetales de casi todos los países del mundo." },
      { id: "the-mall", name: "The Mall", category: "parque", lat: 40.771800, lng: -73.971900, order: 3, description: "El gran paseo triunfal bajo una enorme bóveda de olmos centenarios. Es el corazón romántico e histórico de Central Park.", curiosity: "Es el único camino en todo Central Park diseñado para ser perfectamente recto. Fue creado intencionalmente así para que la gente rica de la época pudiera pasear sus carruajes." },
      { id: "central-park-zoo", name: "Central Park Zoo", category: "atraccion", lat: 40.767800, lng: -73.971800, order: 2, description: "Un coqueto zoológico urbano clásico, famoso por su reloj musical y su encantadora ubicación entre los árboles del parque.", curiosity: "Este fue el zoológico que inspiró la película de animación 'Madagascar', aunque en la vida real es muchísimo más pequeño que en la película." },
      { id: "friends-building", name: "Edificio de Friends", category: "atraccion", lat: 40.732100, lng: -74.006100, order: 11, description: "La famosa fachada exterior de ladrillo del edificio donde supuestamente vivían Mónica, Rachel, Joey y Chandler en la icónica serie.", curiosity: "Aunque la serie transcurre en este edificio de NY, 'Friends' nunca grabó una sola escena con actores en esta calle; absolutamente todo se rodó en estudios de California." },
      { id: "friends-experience", name: "Friends Experience", category: "atraccion", lat: 40.741500, lng: -73.989700, order: 9, description: "Un viaje a la nostalgia televisiva donde podrán pasear por recreaciones exactas de los icónicos apartamentos y la cafetería Central Perk.", curiosity: "Muchos creen que la famosa fuente que sale en la intro de Friends es de Central Park, pero en realidad, la fuente original fue construida en los estudios de Warner Bros en Los Ángeles." },
      { id: "amnh", name: "Museo de Historia Natural", category: "museo", lat: 40.781324, lng: -73.973988, order: 7, description: "El grandioso Museo de Historia Natural, mundialmente famoso por sus gigantescos esqueletos de dinosaurios y su enorme ballena azul.", seeWhat: ["Esqueletos de dinosaurios", "Ballena azul", "Planetario"], curiosity: "El museo es tan colosal que posee más de 34 millones de especímenes, plantas y artefactos, pero solo el 2% de esa inmensa colección está en exhibición al público." },
      { id: "upper-west-side", name: "Upper West Side", category: "barrio", lat: 40.787000, lng: -73.975400, order: 8, description: "Un elegante barrio residencial de amplias avenidas y hermosos edificios de apartamentos clásicos donde se respira la vida vecinal.", food: "Perfecto para probar un verdadero y suave pan 'bagel' neoyorquino en 'Zabar's', una tienda que es toda una institución local.", curiosity: "Aquí se rodó casi por completo el famoso musical 'West Side Story' antes de que derribaran gran parte de las calles viejas para construir el Lincoln Center." },
      { id: "west-village", name: "West Village", category: "barrio", lat: 40.735800, lng: -74.003600, order: 10, description: "Un vecindario de aspecto europeo con calles arboladas en diagonal, casas adosadas de ladrillo rojo y un ritmo de vida encantador.", curiosity: "A diferencia del resto de Manhattan, sus calles no siguen una cuadrícula. ¡Tienen ángulos tan caóticos que la calle 4 y la calle 10 llegan a cruzarse entre sí!" },
    ],
  },
  {
    id: "day-6",
    number: 6,
    title: "Roosevelt Island",
    subtitle: "Teleférico y Upper East Side",
    color: "#14b8a6",
    description:
      "El objetivo es ver la ciudad desde otra perspectiva. Sobrevolarán el río en el teleférico hacia Roosevelt Island para disfrutar de una mañana pacífica, antes de volver al elegante Upper East Side.",
    pace: "Un escape tranquilo del ruido de Manhattan. El recorrido es corto y llano, ideal para una mañana relajada antes de ir de compras o almorzar.",
    places: [
      { id: "roosevelt-tram", name: "Roosevelt Island Tramway", category: "atraccion", lat: 40.761400, lng: -73.963900, order: 1, description: "Un espectacular viaje por el aire en cabina roja cruzando paralelo al gigantesco puente de Queensboro con vistas formidables.", seeWhat: ["Vistas del East River", "Puente de Queensboro"], curiosity: "El viaje dura solo 3 minutos. Cada cabina puede llevar hasta a 110 personas y llega a elevarse casi 80 metros sobre el nivel del East River." },
      { id: "roosevelt-island", name: "Roosevelt Island", category: "barrio", lat: 40.761500, lng: -73.950500, order: 2, description: "Una alargada y tranquila isla en medio del río, perfecta para caminar lejos del ruido constante de los coches de Manhattan.", curiosity: "Antes de ser residencial, la isla se llamaba 'Isla del Bienestar' y albergaba exclusivamente asilos, hospitales de cuarentena y una prisión penitenciaria." },
      { id: "southpoint-park", name: "Southpoint Park", category: "parque", lat: 40.748900, lng: -73.957300, order: 3, description: "Los cuidados jardines en la punta sur de la isla, ofreciendo un gran panorama abierto hacia el enorme edificio de la ONU y el río.", curiosity: "La colina en el sur del parque fue creada de manera sostenible utilizando los escombros generados durante la excavación del túnel de trenes de la isla." },
      { id: "smallpox-hospital", name: "Smallpox Hospital", category: "monumento", lat: 40.748000, lng: -73.958000, order: 4, description: "Las fascinantes e imponentes ruinas cubiertas de hiedra de un hospital del siglo XIX, protegidas como monumento histórico oficial.", curiosity: "Fue el primer gran hospital de EE.UU. dedicado exclusivamente a pacientes de viruela en el siglo XIX. Hoy es la única 'ruina histórica' oficial catalogada de Nueva York." },
      { id: "bloomingdales", name: "Bloomingdale's", category: "compras", lat: 40.762100, lng: -73.967600, order: 5, description: "Los históricos e inmensos grandes almacenes neoyorquinos, famosos por su elegancia y sus icónicas bolsas de compra marrones.", curiosity: "Fueron pioneros en el marketing inventando la famosa 'Brown Bag' (bolsa marrón) en 1973, convirtiendo una simple bolsa de compras en un icono de moda mundial." },
      { id: "upper-east-side", name: "Upper East Side", category: "barrio", lat: 40.773600, lng: -73.956600, order: 6, description: "El barrio más exclusivo y señorial de Nueva York, famoso por sus tiendas de alta costura, porteros uniformados y elegancia clásica.", food: "Si quieren desayunar muy cómodos, la histórica cafetería de estilo antiguo 'Lexington Candy Shop' los transportará a los años 50.", curiosity: "Es el barrio que concentra la mayor cantidad de millonarios y coleccionistas de arte por metro cuadrado de toda la ciudad, y escenario de series como Gossip Girl." },
    ],
  },
  {
    id: "day-7",
    number: 7,
    title: "Museos",
    subtitle: "The Met o MoMA, no los dos a fondo",
    color: "#06b6d4",
    description:
      "Día dedicado al arte y la cultura. Recorrerán la famosa 'Milla de los Museos', pudiendo admirar desde arquitectura única hasta algunas de las obras de arte más importantes de la historia.",
    pace: "Los museos aquí son gigantescos. Elijan solo las dos o tres salas que más les interesen en el mapa del museo para no agotar las piernas.",
    places: [
      { id: "the-met", name: "The Met", category: "museo", lat: 40.779437, lng: -73.963244, order: 1, description: "Un museo enciclopédico de magnitud asombrosa. Pasear por sus enormes galerías es viajar por miles de años de arte de todo el mundo.", seeWhat: ["Templo de Dendur", "Galerías europeas", "Terraza con vistas"], food: "El museo tiene varias cafeterías preciosas. El 'American Wing Café' tiene ventanales al parque e invita a descansar las piernas con un buen café.", curiosity: "Dentro del Met se encuentra el Templo de Dendur, un templo egipcio real del año 15 a.C. regalado a EE.UU. para evitar que quedara hundido por la presa de Asuán en el Nilo." },
      { id: "moma", name: "MoMA", category: "museo", lat: 40.761436, lng: -73.977621, order: 4, description: "El principal museo de arte moderno y contemporáneo del mundo. Hogar de obras maestras deslumbrantes que cambiaron la historia.", seeWhat: ["La noche estrellada", "Las señoritas de Aviñón"], curiosity: "El MoMA fue el primer museo del mundo en incluir 'Videojuegos' (como Pac-Man o Tetris) dentro de su colección permanente de arte y diseño." },
      { id: "guggenheim", name: "Guggenheim", category: "museo", lat: 40.782999, lng: -73.958957, order: 3, description: "Una obra de arte en sí mismo. Su espectacular diseño arquitectónico en espiral blanca es mundialmente famoso.", seeWhat: ["Espiral de Frank Lloyd Wright"], curiosity: "Frank Lloyd Wright diseñó la famosa espiral blanca del museo para que la gente subiera en ascensor y luego fuera bajando la rampa suavemente viendo los cuadros sin cansarse." },
      { id: "museum-mile", name: "Museum Mile", category: "atraccion", lat: 40.780000, lng: -73.959000, order: 2, description: "Un majestuoso tramo arbolado de la Quinta Avenida que concentra una impresionante colección de las mejores instituciones culturales.", curiosity: "Esta 'milla' tiene una concentración tan ridículamente alta de cultura que, una vez al año, cortan la calle entera al tráfico para hacer un festival de museos gratis." },
    ],
  },
  {
    id: "day-8",
    number: 8,
    title: "High Line + Chelsea",
    subtitle: "Chelsea Market, Little Island y Hudson Yards",
    color: "#3b82f6",
    description:
      "Hoy conocerán la cara más vanguardista de la ciudad. El plan es disfrutar del Chelsea Market, pasear por los jardines elevados del High Line y sorprenderse con la arquitectura de Hudson Yards.",
    pace: "El High Line tiene muchísimas banquitas. Si sienten que la caminata es larga, siéntense a disfrutar de los jardines y las vistas sin prisa.",
    places: [
      { id: "chelsea-market", name: "Chelsea Market", category: "restaurante", lat: 40.742400, lng: -74.006100, order: 2, description: "Un antiguo edificio industrial reconvertido en un vibrante mercado gastronómico con túneles de ladrillo visto y puestos de comida.", seeWhat: ["Mercado gastronómico", "Puestos artesanales"], food: "Hay de todo. Prueben los famosísimos (y suaves) tacos de 'Los Tacos No. 1' o siéntense a disfrutar algo dulce en 'Amy's Bread'.", curiosity: "Este edificio era la fábrica original de Nabisco. Exactamente en este lugar es donde se inventaron, hornearon y probaron las primeras galletas Oreo en 1912." },
      { id: "high-line", name: "High Line", category: "parque", lat: 40.748000, lng: -74.004800, order: 3, description: "Un hermoso e innovador jardín lineal suspendido en el aire sobre unas antiguas vías de tren, que atraviesa los edificios del barrio.", seeWhat: ["Jardines elevados", "Vistas del Hudson"], curiosity: "Antes de ser parque, fue una vía de tren de carga muy peligrosa que pasaba a nivel de calle. La elevaron en los años 30 para evitar accidentes mortales." },
      { id: "little-island", name: "Little Island", category: "parque", lat: 40.742000, lng: -74.011000, order: 1, description: "Un moderno parque flotante sobre el río construido sobre unos enormes y curiosos pilares de cemento esculpidos en forma de flor.", food: "Dentro hay pequeños carritos muy simpáticos para comprar algo de tomar y sentarse al sol en los anfiteatros a descansar.", curiosity: "Este parque flotante se sostiene sobre 132 columnas con forma de tulipán que varían en altura. En el fondo, parece una hoja flotando en el agua." },
      { id: "hudson-yards", name: "Hudson Yards", category: "atraccion", lat: 40.753900, lng: -74.002100, order: 4, description: "El nuevo y deslumbrante barrio de cristal de la ciudad, lleno de tiendas de lujo, plazas relucientes y restaurantes vanguardistas.", curiosity: "Es el mayor desarrollo inmobiliario privado en la historia de los Estados Unidos. Literalmente, construyeron una plataforma gigante sobre unas vías de tren operativas para hacer estos rascacielos." },
      { id: "vessel", name: "Vessel", category: "atraccion", lat: 40.753800, lng: -74.001900, order: 5, description: "Una monumental e hipnótica escultura en forma de panal de abejas cobrizo, diseñada para reflejar a la gente y el entorno a su alrededor.", curiosity: "Toda la estructura costó 200 millones de dólares y las piezas fueron fabricadas en Italia, metidas en barcos y montadas en Nueva York como un puzzle gigante." },
      { id: "edge", name: "Edge", category: "mirador", lat: 40.753600, lng: -74.001700, order: 6, description: "Un vertiginoso mirador en forma de cuña suspendido en el aire, que ofrece la sensación de flotar literalmente sobre Nueva York.", seeWhat: ["Suelo de cristal", "Vistas 360º"], food: "En el piso de abajo está 'Mercado Little Spain', un increíble mercado con comida española tradicional (tapas, churros, jamón) ideal para cenar sentados.", curiosity: "Es el mirador al aire libre más alto del hemisferio occidental. Su cristal no es completamente recto: está inclinado hacia afuera para que parezca que flotas sobre el abismo." },
    ],
  },
  {
    id: "day-9",
    number: 9,
    title: "Harlem",
    subtitle: "Misa góspel y comida soul",
    color: "#8b5cf6",
    description:
      "El objetivo es sentir el alma de Harlem. Se sumergirán en su rica herencia cultural, disfrutarán de la profunda emotividad de una auténtica misa góspel y probarán la reconfortante comida sureña.",
    pace: "Un día para disfrutar de la música y la comida sin estrés. La misa góspel es una experiencia inmersiva donde estarán sentados la mayor parte del tiempo.",
    places: [
      { id: "harlem", name: "Harlem", category: "barrio", lat: 40.811600, lng: -73.946500, order: 2, description: "El histórico corazón de la cultura afroamericana en Nueva York. Un barrio lleno de arte, música, historia y preciosas casas rojizas.", seeWhat: ["Brownstones", "Arquitectura residencial"], curiosity: "Durante la Prohibición (los años 20), Harlem tenía cientos de clubes clandestinos, como el famoso Cotton Club, donde actuaban leyendas del jazz mientras que el alcohol fluía en secreto." },
      { id: "gospel-church", name: "Misa góspel (Abyssinian Baptist)", category: "iglesia", lat: 40.815800, lng: -73.941200, order: 1, description: "Iglesias históricas donde la fe cristiana se expresa a través del poderosísimo, rítmico y profundamente emotivo canto góspel comunitario.", curiosity: "La música góspel tiene raíces tan profundas que muchos de sus himnos tradicionales ocultaban mensajes secretos y mapas cantados para guiar a los esclavos prófugos hacia la libertad." },
      { id: "soul-food", name: "Soul food (Sylvia's)", category: "restaurante", lat: 40.808600, lng: -73.944400, order: 4, description: "Restaurantes emblemáticos donde se sirve comida sureña tradicional: fritos, guisos lentos y un ambiente que te hace sentir como en casa.", food: "Vayan sin falta a 'Sylvia's'. Les recomendamos probar su jugoso pollo asado o el pan de maíz recién hecho. El trato es sumamente hogareño y acogedor.", curiosity: "El concepto de 'Soul Food' se originó a partir de las limitadas raciones alimenticias que recibían los esclavos afroamericanos, quienes, con creatividad, transformaron ingredientes humildes en alta gastronomía." },
      { id: "apollo-theater", name: "Apollo Theater", category: "atraccion", lat: 40.809900, lng: -73.950100, order: 3, description: "El teatro más importante de la música negra en Estados Unidos. Su mítica marquesina ha visto nacer a las mayores leyendas musicales.", curiosity: "La noche amateur (Amateur Night) del Apollo lanzó a la fama a artistas legendarios de la talla de Ella Fitzgerald, James Brown, Michael Jackson y Lauryn Hill." },
    ],
  },
  {
    id: "day-10",
    number: 10,
    title: "Compras",
    subtitle: "Opciones realistas con transporte público",
    color: "#ec4899",
    description:
      "¡Día de compras! Ya sea buscando grandes marcas o recuerdos en las tiendas más famosas de la ciudad, hoy el objetivo es encontrar esos detalles perfectos a su propio ritmo.",
    pace: "Ir de compras agota rápido. Prioricen una o dos tiendas específicas y hagan varias 'paradas técnicas' para tomar café y descansar.",
    places: [
      { id: "herald-square", name: "Herald Square", category: "compras", lat: 40.750500, lng: -73.987900, order: 1, description: "Una ajetreada y céntrica plaza presidida por edificios inmensos y el ir y venir de miles de compradores y oficinistas neoyorquinos.", curiosity: "La plaza lleva el nombre de un periódico extinto (el New York Herald). Su reloj central cuenta con búhos mecánicos con ojos que brillan intermitentemente." },
      { id: "macys", name: "Macy's", category: "compras", lat: 40.751000, lng: -73.988800, order: 2, description: "El almacén más grande e icónico del país, una institución de la ciudad que ocupa una manzana entera y rebosa de esplendor clásico.", curiosity: "Macy's de Herald Square fue durante décadas la tienda más grande del mundo. Todavía conserva algunas de sus escaleras mecánicas originales hechas totalmente de madera." },
      { id: "century-21", name: "Century 21", category: "compras", lat: 40.710000, lng: -74.011000, order: 3, description: "Los famosos grandes almacenes de oportunidades en el Distrito Financiero, donde los neoyorquinos van a cazar tesoros y marcas baratas.", curiosity: "Después de los atentados del 11 de septiembre, Century 21 sufrió graves daños estructurales. Su reapertura cinco meses después fue un poderoso símbolo de resiliencia para el Distrito Financiero." },
      { id: "jersey-gardens", name: "Jersey Gardens", category: "compras", lat: 40.664000, lng: -74.169000, order: 4, description: "Un gigantesco centro comercial techado al estilo americano. Es el paraíso de los outlets en Nueva Jersey, sin los impuestos de la ciudad.", curiosity: "Dado que está ubicado en el estado de Nueva Jersey, la ropa y el calzado están libres de impuestos sobre las ventas (tax-free), ahorrando mucho dinero en grandes compras." },
      { id: "woodbury-common", name: "Woodbury Common", category: "compras", lat: 41.334000, lng: -74.118000, order: 5, description: "Un encantador e inmenso pueblo de tiendas de descuento de lujo al aire libre, ideal para un día completo de compras entre la naturaleza.", curiosity: "El recinto de Woodbury Common es tan extenso y tiene tantas calles que dispone de su propia red interna de autobuses para llevar a la gente de un extremo a otro." },
    ],
  },
  {
    id: "day-11",
    number: 11,
    title: "Stamford",
    subtitle: "Playa, casa, piscina y respiro",
    color: "#64748b",
    description:
      "Día de descanso estratégico. El objetivo hoy es no tener prisa, disfrutar de la tranquilidad de Stamford, pasear por la costa y recargar las pilas tras la intensidad de Manhattan.",
    pace: "Día libre para recargar baterías. Un paseo lento por la costa o simplemente descansar es fundamental para recuperar energía.",
    places: [
      { id: "stamford-station", name: "Stamford Train Station", category: "estacion", lat: 41.046900, lng: -73.542000, order: 1, description: "La moderna terminal ferroviaria que conecta perfectamente la pacífica y arbolada vida de Connecticut con el ritmo frenético de Manhattan.", seeWhat: ["Metro-North New Haven Line"], curiosity: "Es la estación más concurrida de la red ferroviaria Metro-North fuera de la ciudad de Nueva York. Conecta la tranquilidad de Connecticut con la locura de Manhattan en solo una hora." },
      { id: "stamford-downtown", name: "Stamford", category: "barrio", lat: 41.053400, lng: -73.538700, order: 2, description: "Un agradable, seguro y ordenado centro urbano para caminar tranquilamente, ver tiendas locales y disfrutar de un café sin prisas.", curiosity: "Conocida históricamente como la 'Ciudad de las Cerraduras', Stamford albergaba a la compañía Yale & Towne, que llegó a fabricar candados y cerraduras para todo el mundo." },
      { id: "cove-island", name: "Cove Island Park", category: "parque", lat: 41.042000, lng: -73.518000, order: 3, description: "Un relajante parque costero con playas, muelles y senderos naturales. Es el rincón perfecto para ver el agua y escuchar a los pájaros.", curiosity: "El parque cuenta con un sendero ecológico y un santuario de aves que es hogar y punto de descanso para decenas de especies durante sus migraciones anuales en primavera." },
    ],
  },
  {
    id: "day-12",
    number: 12,
    title: "Niagara Falls",
    subtitle: "Excursión económica en bus",
    color: "#0ea5e9",
    description:
      "Una expedición hacia la naturaleza. El gran objetivo es escuchar el rugido y sentir la bruma de las majestuosas Cataratas del Niágara, una de las maravillas naturales del continente.",
    pace: "Una excursión que requiere algo de viaje. Aprovechen el transporte para dormir y caminen únicamente por los miradores principales de las cataratas.",
    places: [
      { id: "niagara-park", name: "Niagara Falls State Park", category: "parque", lat: 43.082800, lng: -79.065300, order: 1, description: "El majestuoso parque nacional que rodea el río y los rápidos, lleno de vegetación espesa y caminos pavimentados al borde del precipicio.", seeWhat: ["Miradores exteriores", "Observation Tower"], curiosity: "Es el parque estatal más antiguo de todos los Estados Unidos. Fue fundado en 1885 para proteger las cataratas de la explotación comercial masiva y la industrialización." },
      { id: "american-falls", name: "American Falls", category: "atraccion", lat: 43.084000, lng: -79.068600, order: 2, description: "La inmensa parte de las cataratas que cae de frente a los miradores, ofreciendo un espectáculo ensordecedor de fuerza natural pura.", curiosity: "Solo el 10% del caudal total del río Niágara pasa por el lado estadounidense (American Falls); el 90% restante cae por la herradura canadiense." },
      { id: "bridal-veil", name: "Bridal Veil Falls", category: "atraccion", lat: 43.079600, lng: -79.069900, order: 3, description: "Una sección más fina y hermosa de las cascadas cuyo nombre ('Velo de Novia') proviene de la elegante forma que toma el agua en su larga caída.", curiosity: "La fuerza del viento generado por el choque del agua en Bridal Veil Falls es tan brutal que puede levantar fuertes corrientes de aire verticales capaces de arrancarte el sombrero de la cabeza." },
      { id: "horseshoe-falls", name: "Horseshoe Falls", category: "atraccion", lat: 43.077900, lng: -79.074700, order: 4, description: "La principal y atronadora catarata en forma de herradura, donde millones de litros de agua caen creando una inmensa nube de bruma eterna.", curiosity: "El volumen de agua que cae por Horseshoe Falls es tan inmenso (miles de toneladas por segundo) que la enorme vibración sísmica hace temblar la tierra alrededor de los miradores." },
    ],
  },
];

export const allPlaces: (Place & { dayId: string; dayTitle: string; dayColor: string })[] =
  days.flatMap((d) =>
    d.places.map((p) => ({ ...p, dayId: d.id, dayTitle: `Día ${d.number}: ${d.title}`, dayColor: d.color })),
  );
