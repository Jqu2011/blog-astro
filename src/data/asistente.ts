// Base de conocimiento del asistente local del sitio.
// Todo se ejecuta en el navegador: no hay llamadas a servicios externos ni claves.
// Para añadir una respuesta, crea una nueva intención con disparadores (en minúsculas
// y sin tildes) y el texto que verá la persona.

export interface EnlaceAsistente {
	etiqueta: string;
	/** Ruta interna ('/proyectos/'), URL externa o los atajos '@email' y '@linkedin'. */
	href: string;
}

export interface IntencionAsistente {
	id: string;
	disparadores: string[];
	respuesta: string;
	enlaces?: EnlaceAsistente[];
}

export const bienvenida =
	'¡Hola! Soy el asistente de Julia. Puedo contarte qué hace, cómo trabaja, qué proyectos y artículos tiene, o cómo contactarla. ¿Sobre qué quieres saber?';

export const sugerencias = [
	{ etiqueta: 'Servicios', pregunta: '¿Qué servicios ofrece Julia?' },
	{ etiqueta: 'Proyectos', pregunta: '¿Qué proyectos ha hecho?' },
	{ etiqueta: 'Blog', pregunta: '¿De qué habla en el blog?' },
	{ etiqueta: 'Contacto', pregunta: '¿Cómo puedo contactar con Julia?' },
];

const enlaceContacto: EnlaceAsistente[] = [
	{ etiqueta: 'Escribir por correo', href: '@email' },
	{ etiqueta: 'Ver LinkedIn', href: '@linkedin' },
	{ etiqueta: 'Sección de contacto', href: '/about/#contacto' },
];

export const intenciones: IntencionAsistente[] = [
	{
		id: 'bienvenida',
		disparadores: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'hey', 'que tal'],
		respuesta:
			'¡Hola! Qué gusto. Puedo explicarte los servicios de Julia, sus proyectos, su experiencia o cómo contactarla. También puedes escribir tu pregunta directamente.',
	},
	{
		id: 'perfil',
		disparadores: [
			'quien es',
			'quien eres',
			'sobre julia',
			'perfil',
			'biografia',
			'sobre ella',
			'a que se dedica',
			'presentacion',
			'conocerla',
			'experiencia',
			'trayectoria profesional',
		],
		respuesta:
			'Julia Querevalu es licenciada en Recursos Humanos, con posgrado en RR.HH. y máster en People Analytics y Gestión del Talento Digital. Es docente de HR Analytics en la Universidad San Martín, coach de liderazgo y consultora de RR.HH. Su enfoque: convertir los datos de personas en decisiones más humanas.',
		enlaces: [
			{ etiqueta: 'Conocerla mejor', href: '/about/' },
			{ etiqueta: 'Su formación', href: '/about/#formacion' },
		],
	},
	{
		id: 'servicios',
		disparadores: [
			'servicio',
			'que hace',
			'que ofrece',
			'que ofreces',
			'areas de',
			'en que trabaja',
			'donde trabaja',
			'como trabaja',
			'consultoria',
			'puede ayudar',
		],
		respuesta:
			'Julia trabaja en tres frentes: People Analytics (diagnóstico de talento, clima y rotación), docencia (HR Analytics) y coaching y consultoría de liderazgo y RR.HH. Cada proyecto combina evidencia para entender y conversación para transformar.',
		enlaces: [
			{ etiqueta: 'Qué hace', href: '/#que-hago' },
			{ etiqueta: 'Proyectos', href: '/proyectos/' },
		],
	},
	{
		id: 'people-analytics',
		disparadores: [
			'people analytics',
			'analitica',
			'hr analytics',
			'datos',
			'metricas',
			'dashboard',
			'indicadores',
			'clima',
			'rotacion',
			'engagement',
			'talento',
		],
		respuesta:
			'El People Analytics de Julia no se queda en el dashboard: conecta métricas de personas con decisiones y conversaciones concretas. Trabaja diagnóstico de talento y clima, encuestas pulse, indicadores de rotación y planes de acción con los líderes. La idea es decidir con evidencia sin perder el criterio humano.',
		enlaces: [
			{ etiqueta: 'Leer sobre People Analytics', href: '/blog/people-analytics-para-lideres/' },
			{ etiqueta: 'Radar de Cultura', href: '/proyectos/#radar-de-cultura' },
		],
	},
	{
		id: 'docencia',
		disparadores: [
			'docencia',
			'docente',
			'clases',
			'aula',
			'universidad',
			'san martin',
			'ensen',
			'estudiantes',
			'profesor',
			'academ',
		],
		respuesta:
			'Julia es docente de HR Analytics en la Universidad San Martín. Lleva al aula casos reales de rotación, clima, sucesión y engagement, con práctica de visualización y discusión ética sobre el uso de los datos de personas.',
		enlaces: [
			{ etiqueta: 'Sobre su docencia', href: '/about/#docencia' },
			{ etiqueta: 'Artículo sobre docencia', href: '/blog/docencia-hr-analytics/' },
		],
	},
	{
		id: 'coaching',
		disparadores: ['coaching', 'coach', 'liderazgo', 'lideres', 'mando medio', 'equipos'],
		respuesta:
			'Ofrece coaching de liderazgo individual y grupal, además de consultoría para diseñar diagnósticos de clima, modelos de competencias, planes de sucesión y rutas de formación. Son procesos confidenciales y adaptados al momento de cada equipo.',
		enlaces: [
			{ etiqueta: 'Coaching y consultoría', href: '/about/#coaching' },
			{ etiqueta: 'Artículo sobre liderazgo con datos', href: '/blog/liderazgo-con-datos/' },
		],
	},
	{
		id: 'proyectos',
		disparadores: [
			'proyecto',
			'portafolio',
			'caso',
			'mapa de talento',
			'radar de cultura',
			'escuela de liderazgo',
			'talento digital lab',
			'trabajo realizado',
		],
		respuesta:
			'En el portafolio hay cuatro proyectos: Mapa de Talento 360, Escuela de Liderazgo Analítico, Radar de Cultura y Talento Digital Lab. Muestran su forma de trabajar: analizar, conversar y convertir hallazgos en acciones concretas.',
		enlaces: [{ etiqueta: 'Ver los proyectos', href: '/proyectos/' }],
	},
	{
		id: 'resultados',
		disparadores: ['resultado', 'impacto', 'roi', 'casos de exito', 'beneficio', 'metricas de exito'],
		respuesta:
			'Los proyectos del portafolio son casos ilustrativos, con métricas de ejemplo (por ejemplo, un 28 % menos de tiempo para cubrir puestos críticos o una valoración de 4,7/5). Julia puede adaptar ese enfoque a los datos y retos reales de tu organización.',
		enlaces: [{ etiqueta: 'Ver proyectos y resultados', href: '/proyectos/' }],
	},
	{
		id: 'blog',
		disparadores: ['blog', 'articulo', 'entrada', 'leer', 'publicacion', 'newsletter'],
		respuesta:
			'El blog reúne artículos sobre People Analytics, liderazgo con datos, retención, docencia y talento digital. Hay cinco entradas publicadas y puedes leerlas sin registro.',
		enlaces: [
			{ etiqueta: 'Ir al blog', href: '/blog/' },
			{ etiqueta: 'Retención: más allá del dashboard', href: '/blog/retencion-mas-alla-del-dashboard/' },
		],
	},
	{
		id: 'formacion-academica',
		disparadores: [
			'formacion',
			'estudios',
			'estudiaste',
			'licenciatura',
			'posgrado',
			'master',
			'magister',
			'titulo',
			'curriculum',
			'cv',
			'trayectoria',
			'donde estudio',
		],
		respuesta:
			'Su formación incluye la licenciatura en Recursos Humanos, un posgrado en RR.HH. y un máster en People Analytics y Gestión del Talento Digital, además de formación y práctica en coaching de liderazgo.',
		enlaces: [{ etiqueta: 'Ver formación', href: '/about/#formacion' }],
	},
	{
		id: 'contacto',
		disparadores: [
			'contacto',
			'contactar',
			'correo',
			'email',
			'e-mail',
			'escribir',
			'linkedin',
			'hablar con',
			'reunion',
			'agenda',
			'llamada',
			'whatsapp',
			'contratar',
		],
		respuesta:
			'Puedes escribirle por correo o LinkedIn para conversar sobre un proyecto, una formación para tu equipo o un proceso de liderazgo. Cuéntale brevemente el reto, el equipo implicado y los plazos.',
		enlaces: enlaceContacto,
	},
	{
		id: 'precios',
		disparadores: [
			'precio',
			'tarifa',
			'costo',
			'cuesta',
			'cobr',
			'presupuesto',
			'honorario',
			'inversion',
			'cuanto',
		],
		respuesta:
			'Cada proyecto se diseña a medida, así que el presupuesto depende del alcance, el equipo y el plazo. Lo mejor es contarle tu reto por correo y acordar una primera conversación sin compromiso.',
		enlaces: enlaceContacto,
	},
	{
		id: 'disponibilidad',
		disparadores: [
			'disponib',
			'remoto',
			'online',
			'distancia',
			'ubicacion',
			'donde esta',
			'donde vive',
			'pais',
			'ciudad',
			'viajar',
			'presencial',
			'horario',
		],
		respuesta:
			'Julia trabaja con organizaciones y equipos, y puede abordar proyectos presenciales u online según el caso. Cuéntale desde dónde trabajas y qué necesitas para valorar la mejor modalidad.',
		enlaces: enlaceContacto,
	},
	{
		id: 'capacitacion',
		disparadores: [
			'capacitacion',
			'taller',
			'talleres',
			'formacion para equipos',
			'programa',
			'curso para',
			'equipo de trabajo',
			'empresa',
			'organizacion',
		],
		respuesta:
			'Diseña formación a medida para equipos: itinerarios de HR Analytics, talleres de liderazgo con datos y programas de upskilling digital, con casos reales y aplicación inmediata al trabajo.',
		enlaces: [
			{ etiqueta: 'Escuela de Liderazgo Analítico', href: '/proyectos/#escuela-de-liderazgo-analitico' },
			{ etiqueta: 'Talento Digital Lab', href: '/proyectos/#talento-digital-lab' },
		],
	},
	{
		id: 'charla',
		disparadores: ['charla', 'ponencia', 'conferencia', 'exposicion', 'evento', 'invitacion'],
		respuesta:
			'Julia participa en clases, talleres y sesiones de formación. Para charlas, ponencias o colaboraciones docentes, escríbele con el tema, el público y las fechas propuestas.',
		enlaces: enlaceContacto,
	},
	{
		id: 'idiomas',
		disparadores: ['idioma', 'ingles', 'espanol', 'bilingue'],
		respuesta:
			'El contenido del sitio está en español. Para propuestas en otros idiomas, consúltalo directamente con Julia y valorará la mejor forma de acompañarte.',
		enlaces: enlaceContacto,
	},
	{
		id: 'asistente',
		disparadores: [
			'robot',
			'bot',
			'chatbot',
			'asistente',
			'inteligencia artificial',
			'eres real',
			'como funcion',
		],
		respuesta:
			'Soy un asistente que funciona dentro de la web, sin servicios externos ni claves: respondo con información preparada sobre Julia. Si tu pregunta no está cubierta, te dejo su contacto para que puedas escribirle.',
		enlaces: enlaceContacto,
	},
	{
		id: 'agradecimiento',
		disparadores: ['gracias', 'genial', 'perfecto', 'muy util', 'excelente'],
		respuesta:
			'¡Gracias a ti! Si quieres seguir explorando, el blog y los proyectos están abiertos. Y si prefieres hablar directamente con Julia, aquí tienes su contacto.',
		enlaces: [
			{ etiqueta: 'Blog', href: '/blog/' },
			{ etiqueta: 'Contacto', href: '/about/#contacto' },
		],
	},
	{
		id: 'despedida',
		disparadores: ['adios', 'chao', 'hasta luego', 'nos vemos', 'bye'],
		respuesta: '¡Hasta luego! Puedes volver cuando quieras o escribirle a Julia directamente.',
		enlaces: enlaceContacto,
	},
];

export const respuestaPorDefecto: IntencionAsistente = {
	id: 'sin-respuesta',
	disparadores: [],
	respuesta:
		'No tengo una respuesta preparada para eso. Puedo hablar de los servicios de Julia, sus proyectos, el blog, su formación o cómo contactarla. Si prefieres, escríbele directamente y te responde ella.',
	enlaces: [
		{ etiqueta: 'Escribir por correo', href: '@email' },
		{ etiqueta: 'Ver el blog', href: '/blog/' },
		{ etiqueta: 'Sobre Julia', href: '/about/' },
	],
};

/** Normaliza el texto para comparar sin tildes, mayúsculas ni signos. */
export function normalizar(texto: string): string {
	return texto
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Devuelve la intención con más coincidencias. Los disparadores son fragmentos:
 * "proyect" encuentra "proyecto", "proyectos" y "proyectos".
 */
export function buscarIntencion(texto: string): IntencionAsistente | null {
	const consulta = normalizar(texto);
	if (!consulta) return null;

	const palabras = new Set(consulta.split(' '));
	let mejor: IntencionAsistente | null = null;
	let mejorPuntuacion = 0;

	for (const intencion of intenciones) {
		let puntuacion = 0;
		for (const disparador of intencion.disparadores) {
			const objetivo = normalizar(disparador);
			if (objetivo.length <= 2 ? palabras.has(objetivo) : consulta.includes(objetivo)) {
				puntuacion += objetivo.length;
			}
		}
		if (puntuacion > mejorPuntuacion) {
			mejor = intencion;
			mejorPuntuacion = puntuacion;
		}
	}

	// 4 puntos evitan que una coincidencia accidental muy corta dispare una respuesta.
	return mejorPuntuacion >= 4 ? mejor : null;
}
