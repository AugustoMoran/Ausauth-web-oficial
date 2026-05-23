/**
 * 🗺️ VALIDACIÓN DE GEOLOCALIZACIÓN - CABA/AMBA
 *
 * Prioridad:
 *  1. Google Maps Geocoding (coordenadas + partido extraído del response)
 *  2. Fallback por palabras clave contra partidos Y localidades conocidas
 */

const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ── Lista completa de partidos del AMBA ──────────────────────────────────────
// Incluye todos los 40 partidos del conurbano bonaerense + CABA
const AMBA_PARTIDOS = [
  // CABA
  'CABA',
  'Ciudad Autónoma de Buenos Aires',
  'Ciudad de Buenos Aires',
  'Buenos Aires Federal',

  // 1ra corona
  'Avellaneda',
  'Lanús',
  'Lomas de Zamora',
  'Quilmes',
  'Almirante Brown',
  'Morón',
  'Hurlingham',
  'Ituzaingó',
  'La Matanza',
  'Tres de Febrero',
  'San Martín',
  'General San Martín',
  'San Isidro',
  'Vicente López',

  // 2da corona
  'Berazategui',
  'Florencio Varela',
  'Ezeiza',
  'Esteban Echeverría',
  'Merlo',
  'Moreno',
  'Marcos Paz',
  'General Rodríguez',
  'Luján',
  'Tigre',
  'San Fernando',
  'San Miguel',
  'Malvinas Argentinas',
  'José C. Paz',
  'General San Martín',
  'Pilar',
  'Escobar',
  'Campana',
  'Zárate',
  'La Plata',
  'Berisso',
  'Ensenada',
  'Cañuelas',
  'General Las Heras',
];

// ── Mapa localidad → partido ─────────────────────────────────────────────────
// Cubre las localidades más buscadas que no coinciden con el nombre del partido
const LOCALIDAD_A_PARTIDO = {
  // Morón
  'el palomar': 'Morón',
  'palomar': 'Morón',
  'haedo': 'Morón',
  'castelar': 'Morón',
  'villa sarmiento': 'Morón',
  'villa nueva': 'Morón',

  // Hurlingham
  'hurlingham': 'Hurlingham',
  'william c morris': 'Hurlingham',
  'villa tesei': 'Hurlingham',

  // Ituzaingó
  'ituzaingo': 'Ituzaingó',
  'ituzaingó': 'Ituzaingó',

  // La Matanza
  'san justo': 'La Matanza',
  'ramos mejia': 'La Matanza',
  'ramos mejía': 'La Matanza',
  'tapiales': 'La Matanza',
  'villa luzuriaga': 'La Matanza',
  'isidro casanova': 'La Matanza',
  'laferrere': 'La Matanza',
  'gonzalez catan': 'La Matanza',
  'ciudad evita': 'La Matanza',
  '20 de junio': 'La Matanza',

  // Tres de Febrero
  'ciudadela': 'Tres de Febrero',
  'santos lugares': 'Tres de Febrero',
  'caseros': 'Tres de Febrero',
  'pablo podesta': 'Tres de Febrero',
  'pablo podestá': 'Tres de Febrero',
  'jose ingenieros': 'Tres de Febrero',
  'José Ingenieros': 'Tres de Febrero',

  // General San Martín
  'san martin': 'General San Martín',
  'san martín': 'General San Martín',
  'villa ballester': 'General San Martín',
  'villa lynch': 'General San Martín',
  'villa maipú': 'General San Martín',
  'palermo chico': 'General San Martín',
  'jose leon suarez': 'General San Martín',
  'josé león suárez': 'General San Martín',

  // San Isidro
  'beccar': 'San Isidro',
  'martinez': 'San Isidro',
  'martínez': 'San Isidro',
  'boulogne': 'San Isidro',
  'villa adelina': 'San Isidro',

  // Vicente López
  'olivos': 'Vicente López',
  'florida': 'Vicente López',
  'florida oeste': 'Vicente López',
  'munro': 'Vicente López',
  'villa martelli': 'Vicente López',
  'la lucila': 'Vicente López',

  // Lomas de Zamora
  'temperley': 'Lomas de Zamora',
  'banfield': 'Lomas de Zamora',
  'turdera': 'Lomas de Zamora',
  'llavallol': 'Lomas de Zamora',
  'ingeniero budge': 'Lomas de Zamora',

  // Quilmes
  'bernal': 'Quilmes',
  'ezpeleta': 'Quilmes',
  'quilmes oeste': 'Quilmes',

  // Avellaneda
  'dock sud': 'Avellaneda',
  'crucecita': 'Avellaneda',
  'wilde': 'Avellaneda',
  'piñeyro': 'Avellaneda',

  // Almirante Brown
  'adrogué': 'Almirante Brown',
  'adrogue': 'Almirante Brown',
  'burzaco': 'Almirante Brown',
  'claypole': 'Almirante Brown',
  'glew': 'Almirante Brown',
  'longchamps': 'Almirante Brown',
  'malvinas argentinas': 'Almirante Brown',
  'rafael calzada': 'Almirante Brown',

  // Ezeiza
  'ezeiza': 'Ezeiza',
  'canning': 'Ezeiza',
  'tristán suárez': 'Ezeiza',
  'tristan suarez': 'Ezeiza',

  // Tigre
  'don torcuato': 'Tigre',
  'tigre centro': 'Tigre',
  'general pacheco': 'Tigre',
  'rincon de milberg': 'Tigre',
  'nordelta': 'Tigre',

  // Pilar
  'del viso': 'Pilar',
  'villa rosa': 'Pilar',
  'fátima': 'Pilar',
  'fatima': 'Pilar',

  // Escobar
  'belen de escobar': 'Escobar',
  'belén de escobar': 'Escobar',
  'garín': 'Escobar',
  'garin': 'Escobar',
  'maquinista savio': 'Escobar',
};

// Barrios de CABA (selección representativa)
const BARRIOS_CABA = [
  'almagro','balvanera','barracas','belgrano','boca','boedo','caballito',
  'chacarita','coghlan','colegiales','constitucion','flores','floresta',
  'liniers','lugano','monte castro','monserrat','nueva pompeya','nunez',
  'nuñez','palermo','parque avellaneda','parque chacabuco','parque chas',
  'parque patricios','paternal','pompeya','puerto madero','recoleta',
  'retiro','saavedra','san cristobal','san nicolas','san telmo','soldati',
  'versalles','villa crespo','villa del parque','villa devoto','villa gral mitre',
  'villa lugano','villa luro','villa ortuzar','villa pueyrredon','villa real',
  'villa riachuelo','villa santa rita','villa soldati','villa urquiza',
  'velez sarsfield','versalles','agronomia','agronomía',
];

// ── Límites geográficos ──────────────────────────────────────────────────────
const CABA_BOUNDS = {
  north: -34.5270,
  south: -34.7050,
  east: -58.3340,
  west: -58.5320,
};

// Bounding box amplio que cubre todo el AMBA (hasta 3ra corona)
const AMBA_EXPANDED_BOUNDS = {
  north: -34.2800,
  south: -35.1500,
  east: -58.0500,
  west: -59.3000,
};

// ── Google Maps Geocoding ────────────────────────────────────────────────────
async function geocodifyAddress(direccion) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️  GOOGLE_MAPS_API_KEY no configurado. Usando fallback.');
    return null;
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: `${direccion}, Argentina`,
        key: GOOGLE_MAPS_API_KEY,
        region: 'ar',
        language: 'es',
      },
      timeout: 5000,
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      console.warn(`⚠️  Google Maps sin resultados para: ${direccion}`);
      return null;
    }

    const result = results[0];
    const { lat, lng } = result.geometry.location;
    const components = result.address_components;

    let partido = null;
    let localidad = null;
    let sublocality = null;
    let provincia = null;

    for (const c of components) {
      const types = c.types;
      // Partido / municipio
      if (types.includes('administrative_area_level_2')) partido = c.long_name;
      // Localidad (ciudad, pueblo)
      if (types.includes('locality')) localidad = c.long_name;
      // Barrio / sublocality
      if (types.includes('sublocality') || types.includes('sublocality_level_1')) sublocality = c.long_name;
      // Provincia
      if (types.includes('administrative_area_level_1')) provincia = c.long_name;
    }

    // Limpiar prefijos que agrega Google ("Partido de X")
    if (partido) partido = partido.replace(/^Partido\s+de\s+/i, '').trim();

    console.log(`✅ Google Maps: lat=${lat} lng=${lng} partido="${partido}" localidad="${localidad}" sublocality="${sublocality}" provincia="${provincia}"`);

    return { lat, lng, partido, localidad, sublocality, provincia, formattedAddress: result.formatted_address };
  } catch (error) {
    console.error('❌ Error en Google Maps Geocoding:', error.message);
    return null;
  }
}

// ── Helpers de validación ────────────────────────────────────────────────────
function isWithinCABA(lat, lng) {
  return (
    lat <= CABA_BOUNDS.north && lat >= CABA_BOUNDS.south &&
    lng <= CABA_BOUNDS.east  && lng >= CABA_BOUNDS.west
  );
}

function isWithinAMBACoordinates(lat, lng) {
  return (
    lat <= AMBA_EXPANDED_BOUNDS.north && lat >= AMBA_EXPANDED_BOUNDS.south &&
    lng <= AMBA_EXPANDED_BOUNDS.east  && lng >= AMBA_EXPANDED_BOUNDS.west
  );
}

function isPartidoInAMBA(nombre) {
  if (!nombre) return false;
  const n = nombre.toLowerCase().trim();
  return AMBA_PARTIDOS.some(p => {
    const pl = p.toLowerCase();
    return pl === n || n.includes(pl) || pl.includes(n);
  });
}

// Busca si una cadena es barrio de CABA
function isBarrioCABA(texto) {
  if (!texto) return false;
  const t = texto.toLowerCase().trim();
  return BARRIOS_CABA.some(b => b === t || t.includes(b) || b.includes(t));
}

/**
 * Dado un texto (localidad / partido), intenta resolver a un partido conocido de AMBA.
 * Primero mira el mapa de localidades, luego la lista de partidos directamente.
 */
function resolvePartidoAMBA(texto) {
  if (!texto) return null;
  const t = texto.toLowerCase().trim();

  // 1. Mapa de localidades
  if (LOCALIDAD_A_PARTIDO[t]) return LOCALIDAD_A_PARTIDO[t];

  // 2. Búsqueda parcial en mapa de localidades
  for (const [loc, part] of Object.entries(LOCALIDAD_A_PARTIDO)) {
    if (t.includes(loc) || loc.includes(t)) return part;
  }

  // 3. Lista de partidos directamente
  if (isPartidoInAMBA(texto)) {
    return AMBA_PARTIDOS.find(p => {
      const pl = p.toLowerCase();
      return pl === t || t.includes(pl) || pl.includes(t);
    }) || texto;
  }

  return null;
}

// ── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────
/**
 * Valida si una dirección está en CABA/AMBA.
 * Prioriza coordenadas + datos de Google Maps.
 * Si no hay API key, usa fallback por palabras clave.
 */
async function validateLocationAMBA(direccion) {
  console.log(`🗺️  Validando: "${direccion}"`);

  if (!direccion || !direccion.trim()) {
    return { esEnAMBA: false, caba: false, coordenadas: null, partido: null, detalle: 'Dirección vacía' };
  }

  // ── Intento con Google Maps ──────────────────────────────────────────────
  const geoData = await geocodifyAddress(direccion);

  if (geoData) {
    const { lat, lng, partido, localidad, sublocality, provincia, formattedAddress } = geoData;

    const esEnCABA = isWithinCABA(lat, lng);
    const esEnAMBACoords = isWithinAMBACoordinates(lat, lng);

    // Validar partido y localidad contra la lista
    const partidoResuelto = resolvePartidoAMBA(partido) ||
                            resolvePartidoAMBA(localidad) ||
                            resolvePartidoAMBA(sublocality);

    const esPartidoAMBA = !!partidoResuelto;
    const esBarrioCABA  = isBarrioCABA(sublocality) || isBarrioCABA(localidad);

    // Decisión: primero coordenadas (más preciso), luego partido/localidad
    const esEnAMBA = esEnCABA || esEnAMBACoords || esPartidoAMBA || esBarrioCABA;
    const esCABAFinal = esEnCABA || esBarrioCABA;

    const partidoFinal = partidoResuelto || partido || localidad;

    console.log(`🎯 Google Maps → CABA=${esCABAFinal} AMBA_coords=${esEnAMBACoords} partido_ok=${esPartidoAMBA} → esEnAMBA=${esEnAMBA} (partido: "${partidoFinal}")`);

    return {
      esEnAMBA,
      caba: esCABAFinal,
      coordenadas: { lat, lng },
      partido: partidoFinal,
      provincia,
      formattedAddress,
      detalle: esEnAMBA ? `Cobertura disponible (${partidoFinal || 'AMBA'})` : 'Fuera de cobertura CABA/AMBA',
    };
  }

  // ── Fallback: búsqueda por palabras clave ────────────────────────────────
  console.warn(`⚠️  Sin Google Maps. Fallback por keywords para: "${direccion}"`);
  const dir = direccion.toLowerCase().trim();

  // CABA: por indicadores directos o barrios conocidos
  const esCABA =
    dir.includes('caba') ||
    dir.includes('ciudad autónoma') ||
    dir.includes('ciudad de buenos aires') ||
    dir.includes('capital federal') ||
    BARRIOS_CABA.some(b => {
      const regex = new RegExp(`\\b${b.replace(/[()]/g, '')}\\b`, 'i');
      return regex.test(dir);
    });

  // Intentar resolver cada "token" de la dirección como localidad o partido
  // La dirección suele tener formato "calle num, ciudad, provincia"
  const tokens = dir.split(/[,\s]+/).filter(t => t.length > 2);
  let partidoEncontrado = null;

  // 1. Coincidencia exacta en mapa de localidades
  for (const [loc, part] of Object.entries(LOCALIDAD_A_PARTIDO)) {
    if (dir.includes(loc)) {
      partidoEncontrado = part;
      break;
    }
  }

  // 2. Coincidencia en lista de partidos
  if (!partidoEncontrado) {
    for (const p of AMBA_PARTIDOS) {
      const pl = p.toLowerCase();
      const regex = new RegExp(`\\b${pl.replace(/[áéíóú]/g, c => `[${c}${c.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}]`)}\\b`, 'i');
      if (regex.test(dir) || dir.includes(pl)) {
        partidoEncontrado = p;
        break;
      }
    }
  }

  console.log(`   Fallback → CABA=${esCABA} partido="${partidoEncontrado}"`);

  return {
    esEnAMBA: esCABA || !!partidoEncontrado,
    caba: esCABA,
    coordenadas: null,
    partido: partidoEncontrado || null,
    detalle: (esCABA || partidoEncontrado)
      ? `Cobertura por keywords (${partidoEncontrado || 'CABA'})`
      : 'Sin zona detectada (configura GOOGLE_MAPS_API_KEY para mayor precisión)',
  };
}

module.exports = {
  validateLocationAMBA,
  geocodifyAddress,
  isWithinCABA,
  isWithinAMBACoordinates,
  isPartidoInAMBA,
};
