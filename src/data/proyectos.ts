import type { ImageMetadata } from 'astro';
import mapaTalento from '../assets/proyecto-mapatalento.webp';
import escuelaLiderazgo from '../assets/proyecto-escuela-liderazgo.webp';
import radarCultura from '../assets/proyecto-radar-cultura.webp';
import talentoDigital from '../assets/proyecto-talento-digital.webp';

export interface Proyecto {
	titulo: string;
	categoria: string;
	anio: number;
	resumen: string;
	reto: string;
	solucion: string;
	resultado: string;
	etiquetas: string[];
	imagen: ImageMetadata;
}

// Proyectos de ejemplo creados para mostrar el enfoque de trabajo.
// Sustituye los textos por tus casos reales cuando los tengas.
export const proyectos: Proyecto[] = [
	{
		titulo: 'Mapa de Talento 360',
		categoria: 'Consultoría de RR.HH.',
		anio: 2026,
		resumen:
			'Un modelo visual para entender capacidades, brechas y sucesión en equipos que crecen rápido.',
		reto: 'Una organización en expansión no sabía qué competencias críticas tenía en cada área ni quién podía cubrir los puestos clave.',
		solucion:
			'Diseñé una matriz de habilidades con weighted scoring, entrevistas con líderes y un mapa de sucesión vivo, conectado a los objetivos del negocio.',
		resultado: 'Reducción del 28% en el tiempo de cobertura de puestos críticos y prioridades de formación claras para el año siguiente.',
		etiquetas: ['People Analytics', 'Sucesión', 'Gestión del talento'],
		imagen: mapaTalento,
	},
	{
		titulo: 'Escuela de Liderazgo Analítico',
		categoria: 'Formación y docencia',
		anio: 2025,
		resumen:
			'Un programa práctico para que líderes y mandos medios tomen decisiones con datos sin perder el criterio humano.',
		reto: 'Los equipos tenían dashboards, pero los líderes no sabían traducir métricas de personas en conversaciones y acciones concretas.',
		solucion:
			'Creé un itinerario de 6 módulos con casos reales, laboratorios de métricas y sesiones de coaching grupal aplicadas a equipos propios.',
		resultado: '4 cohortes, 120 líderes formados y una valoración media de 4,7/5 en aplicabilidad inmediata.',
		etiquetas: ['HR Analytics', 'Liderazgo', 'Formación'],
		imagen: escuelaLiderazgo,
	},
	{
		titulo: 'Radar de Cultura',
		categoria: 'People Analytics',
		anio: 2025,
		resumen:
			'Diagnóstico temprano de clima y compromiso mediante encuestas pulse y análisis de señales cualitativas.',
		reto: 'La rotación crecía en áreas específicas y los indicadores tradicionales llegaban tarde para actuar.',
		solucion:
			'Implementé pulses quincenales, análisis de comentarios y un panel de alertas por equipo, con recomendaciones accionables para cada líder.',
		resultado: 'Tres focos de rotación identificados a tiempo y planes de retención desplegados en menos de 30 días.',
		etiquetas: ['Engagement', 'Retención', 'Encuestas pulse'],
		imagen: radarCultura,
	},
	{
		titulo: 'Talento Digital Lab',
		categoria: 'Transformación digital',
		anio: 2024,
		resumen:
			'Ruta de upskilling para que perfiles de RR.HH. y operaciones trabajen con confianza datos y herramientas digitales.',
		reto: 'El equipo de RR.HH. quería pasar de reportes manuales a análisis, pero no sabía por dónde empezar ni cómo medir el avance.',
		solucion:
			'Diseñé una ruta por niveles con retos semanales, mentorías y un portafolio de casos resueltos con datos reales de la organización.',
		resultado: 'El 85% de los participantes aplicó una competencia digital en su trabajo en menos de tres meses.',
		etiquetas: ['Talento digital', 'Upskilling', 'Transformación'],
		imagen: talentoDigital,
	},
];
