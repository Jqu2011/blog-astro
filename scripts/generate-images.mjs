import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Ilustraciones editoriales locales para la web de Julia Querevalu.
// Se dibujan con SVG y se convierten a WebP con sharp. No hay texto ni logotipos.
// Ejecuta `node scripts/generate-images.mjs` para regenerarlas.
// ---------------------------------------------------------------------------

const outDir = resolve('src/assets');
await mkdir(outDir, { recursive: true });

const C = {
	cream: '#f7f2e9',
	paper: '#fffdf8',
	navy: '#16233f',
	navy2: '#1f3470',
	blue: '#2f6fed',
	teal: '#36bfd6',
	coral: '#ef7a63',
	coral2: '#dd5f49',
	gold: '#f3bd5b',
	ink: '#23304d',
	gray: '#dbe1ec',
	skin: '#e8b18f',
	skin2: '#cf8f6c',
	hair: '#2a2230',
};

const blogSize = { w: 1600, h: 840 };
const projectSize = { w: 1600, h: 1067 };
const perfilSize = { w: 1400, h: 886 };

// --- primitivas -----------------------------------------------------------

const rect = (x, y, w, h, r, fill, extra = '') =>
	`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;

const circle = (cx, cy, r, fill, extra = '') =>
	`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;

const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;

const dots = (x, y, cols, rows, gap, r, fill, opacity = 1) => {
	let out = '';
	for (let i = 0; i < cols; i += 1) {
		for (let j = 0; j < rows; j += 1) {
			out += circle(x + i * gap, y + j * gap, r, fill, `opacity="${opacity}"`);
		}
	}
	return out;
};

const shadow = (x, y, w, h, r, opacity = 0.1) =>
	rect(x + 10, y + 18, w, h, r, C.navy, `opacity="${opacity}"`);

const panel = (x, y, w, h, r, fill = C.paper, stroke = 'rgba(22,35,63,0.1)') =>
	shadow(x, y, w, h, r) +
	rect(x, y, w, h, r, fill, `stroke="${stroke}" stroke-width="2"`);

const bars = (x, y, w, h, values, color, opacity = 1) => {
	const gap = w / (values.length * 1.55);
	const barW = gap * 0.55;
	const max = Math.max(...values);
	return values
		.map((value, index) => {
			const barH = (value / max) * h;
			return rect(
				x + index * (barW + gap * 0.6),
				y + h - barH,
				barW,
				barH,
				barW / 2,
				color,
				`opacity="${opacity}"`,
			);
		})
		.join('');
};

const lineChart = (x, y, w, h, values, color, width = 6) => {
	const max = Math.max(...values);
	const min = Math.min(...values);
	const step = w / (values.length - 1);
	const points = values.map((value, index) => {
		const px = x + index * step;
		const py = y + h - ((value - min) / (max - min || 1)) * h;
		return [px, py];
	});
	const d = points.map(([px, py], index) => `${index === 0 ? 'M' : 'L'}${px} ${py}`).join(' ');
	return (
		path(d, 'none', `stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`) +
		points
			.filter((_, index) => index % 2 === 0)
			.map(([px, py]) => circle(px, py, width * 0.9, C.paper, `stroke="${color}" stroke-width="${width * 0.55}"`))
			.join('')
	);
};

const donut = (cx, cy, r, thickness, segments, start = -90) => {
	let angle = start;
	return segments
		.map(({ value, color }) => {
			const sweep = value * 360;
			const end = angle + sweep - 3;
			const startRad = (angle * Math.PI) / 180;
			const endRad = (end * Math.PI) / 180;
			const rOut = r;
			const rIn = r - thickness;
			const x1 = cx + rOut * Math.cos(startRad);
			const y1 = cy + rOut * Math.sin(startRad);
			const x2 = cx + rOut * Math.cos(endRad);
			const y2 = cy + rOut * Math.sin(endRad);
			const x3 = cx + rIn * Math.cos(endRad);
			const y3 = cy + rIn * Math.sin(endRad);
			const x4 = cx + rIn * Math.cos(startRad);
			const y4 = cy + rIn * Math.sin(startRad);
			const large = sweep > 180 ? 1 : 0;
			angle += sweep;
			return path(
				`M${x1} ${y1} A${rOut} ${rOut} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4} Z`,
				color,
			);
		})
		.join('');
};

const arcs = (cx, cy, radii, stroke, width = 2, opacity = 0.4) =>
	radii
		.map((r) => circle(cx, cy, r, 'none', `stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"`))
		.join('');

const spark = (cx, cy, size, color, opacity = 1) =>
	path(
		`M${cx} ${cy - size} Q${cx + size * 0.18} ${cy - size * 0.18} ${cx + size} ${cy} Q${cx + size * 0.18} ${cy + size * 0.18} ${cx} ${cy + size} Q${cx - size * 0.18} ${cy + size * 0.18} ${cx - size} ${cy} Q${cx - size * 0.18} ${cy - size * 0.18} ${cx} ${cy - size} Z`,
		color,
		`opacity="${opacity}"`,
	);

// Figura de cuerpo entero, estilo silueta editorial.
function figura({
	x,
	y,
	s = 1,
	body = C.navy,
	accent = C.coral,
	skin = null,
	hair = null,
	arm = 'down',
}) {
	const head = skin ?? body;
	const pelo = hair ?? body;
	const armPath =
		arm === 'point'
			? `<rect x="24" y="-148" width="13" height="62" rx="6.5" fill="${body}" transform="rotate(-52 30 -118)"/>`
			: `<rect x="24" y="-146" width="13" height="70" rx="6.5" fill="${body}" transform="rotate(7 30 -112)"/>`;
	return `<g transform="translate(${x} ${y}) scale(${s})">
		<ellipse cx="0" cy="6" rx="44" ry="9" fill="${C.navy}" opacity="0.1"/>
		${rect(-21, -80, 16, 80, 8, body)}
		${rect(5, -80, 16, 80, 8, body)}
		${path('M-31 -84 Q-35 -152 0 -152 Q35 -152 31 -84 Z', body)}
		${path('M-10 -152 L0 -128 L10 -152 Z', accent)}
		<rect x="-7" y="-168" width="14" height="22" rx="6" fill="${head}"/>
		${circle(0, -186, 26, head)}
		<path d="M-27 -190 Q-30 -220 0 -220 Q30 -220 27 -190 Q18 -206 0 -206 Q-18 -206 -27 -190 Z" fill="${pelo}"/>
		<rect x="-38" y="-148" width="12" height="70" rx="6" fill="${body}" transform="rotate(-7 -32 -114)"/>
		${armPath}
	</g>`;
}

// Retrato de busto para escenas de aula o reunión.
function busto({ x, y, s = 1, body = C.navy, accent = C.coral, skin = null, hair = null }) {
	const head = skin ?? body;
	const pelo = hair ?? body;
	return `<g transform="translate(${x} ${y}) scale(${s})">
		${path('M-36 34 Q-40 -52 0 -52 Q40 -52 36 34 Z', body)}
		${path('M-10 -50 L0 -22 L10 -50 Z', accent)}
		<rect x="-7" y="-66" width="14" height="24" rx="7" fill="${head}"/>
		${circle(0, -86, 26, head)}
		<path d="M-27 -90 Q-30 -119 0 -119 Q30 -119 27 -90 Q18 -105 0 -105 Q-18 -105 -27 -90 Z" fill="${pelo}"/>
	</g>`;
}

// Retrato de busto para la página de perfil.
function retrato(cx, cy, s = 1) {
	return `<g transform="translate(${cx} ${cy}) scale(${s})">
		<path d="M-120 40 Q-146 -140 0 -160 Q146 -140 120 40 Q118 170 82 220 L-82 220 Q-118 170 -120 40 Z" fill="${C.hair}"/>
		${rect(-30, 30, 60, 120, 24, C.skin2)}
		${path('M-220 360 Q-214 180 -90 126 L0 170 L90 126 Q214 180 220 360 Z', C.coral)}
		${path('M-72 138 L0 194 L72 138 L52 360 L-52 360 Z', C.paper)}
		<ellipse cx="0" cy="0" rx="88" ry="104" fill="${C.skin}"/>
		<path d="M-88 6 Q-104 -116 0 -128 Q104 -116 88 6 Q78 -66 34 -84 Q0 -54 -34 -84 Q-78 -66 -88 6 Z" fill="${C.hair}"/>
		<path d="M-58 -12 q16 -9 30 0" fill="none" stroke="${C.hair}" stroke-width="5" stroke-linecap="round"/>
		<path d="M28 -12 q16 -9 30 0" fill="none" stroke="${C.hair}" stroke-width="5" stroke-linecap="round"/>
		<circle cx="-43" cy="4" r="5" fill="${C.ink}"/>
		<circle cx="43" cy="4" r="5" fill="${C.ink}"/>
		<path d="M-4 18 q-8 24 6 26" fill="none" stroke="${C.skin2}" stroke-width="4" stroke-linecap="round"/>
		<path d="M-26 54 q26 22 52 0" fill="none" stroke="${C.coral2}" stroke-width="5" stroke-linecap="round"/>
		${circle(-88, 40, 8, C.gold)}
		${circle(88, 40, 8, C.gold)}
		${path('M-140 250 Q-170 260 -186 288', 'none', `stroke="${C.coral2}" stroke-width="3" opacity="0.5"`)}
	</g>`;
}

const grain = `<filter id="grain">
	<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
	<feColorMatrix type="saturate" values="0"/>
</filter>`;

function doc(w, h, body, bg = C.cream) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
	<defs>
		<linearGradient id="navyGrad" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="${C.navy2}"/>
			<stop offset="100%" stop-color="${C.navy}"/>
		</linearGradient>
		<linearGradient id="coralGrad" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="${C.coral}"/>
			<stop offset="100%" stop-color="${C.coral2}"/>
		</linearGradient>
		<linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="${C.teal}"/>
			<stop offset="100%" stop-color="${C.blue}"/>
		</linearGradient>
		<linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="${C.gold}"/>
			<stop offset="100%" stop-color="${C.coral}"/>
		</linearGradient>
		<radialGradient id="glow" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="${C.gold}" stop-opacity="0.55"/>
			<stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
		</radialGradient>
		${grain}
	</defs>
	${rect(0, 0, w, h, 0, bg)}
	${body}
	${rect(0, 0, w, h, 0, 'none', 'filter="url(#grain)" opacity="0.035"')}
</svg>`;
}

// --- escenas --------------------------------------------------------------

function blogPeopleAnalytics() {
	const { w, h } = blogSize;
	return doc(
		w,
		h,
		`
		${circle(1330, 168, 190, 'url(#coralGrad)', 'opacity="0.92"')}
		${circle(1330, 168, 240, 'none', `stroke="${C.gold}" stroke-width="3" opacity="0.5"`)}
		${dots(1120, 610, 7, 4, 26, 3.5, C.navy, 0.18)}
		${arcs(300, 210, [70, 108, 146], C.navy, 2, 0.16)}
		${panel(820, 190, 640, 470, 36, 'url(#navyGrad)', 'rgba(255,255,255,0.08)')}
		${rect(870, 240, 150, 14, 7, C.cream, 'opacity="0.35"')}
		${rect(870, 268, 90, 10, 5, C.cream, 'opacity="0.2"')}
		${bars(880, 330, 300, 230, [30, 52, 44, 70, 58, 86], 'url(#tealGrad)', 0.95)}
		${lineChart(880, 330, 300, 230, [20, 48, 40, 64, 58, 88], C.gold, 6)}
		${donut(1310, 430, 82, 26, [
			{ value: 0.46, color: C.coral },
			{ value: 0.3, color: C.teal },
			{ value: 0.24, color: C.gold },
		])}
		${circle(1310, 430, 44, C.navy)}
		${spark(1310, 430, 18, C.cream, 0.9)}
		${rect(1180, 540, 88, 12, 6, C.cream, 'opacity="0.3"')}
		${rect(1180, 566, 56, 10, 5, C.cream, 'opacity="0.18"')}
		${figura({ x: 430, y: 740, s: 1.75, body: C.navy, accent: C.coral, arm: 'point' })}
		${figura({ x: 610, y: 770, s: 1.55, body: C.blue, accent: C.gold })}
		${figura({ x: 250, y: 782, s: 1.35, body: C.coral, accent: C.cream })}
		${path('M300 700 Q470 600 760 640', 'none', `stroke="${C.navy}" stroke-width="2" stroke-dasharray="6 10" opacity="0.28"`)}
		${circle(760, 640, 7, C.coral)}
		`,
	);
}

function blogRetencion() {
	const { w, h } = blogSize;
	return doc(
		w,
		h,
		`
		${circle(1180, 430, 300, 'url(#glow)')}
		${arcs(1180, 430, [110, 180, 250, 320], C.teal, 2, 0.3)}
		${arcs(1180, 430, [145, 215, 285], C.coral, 1.5, 0.22)}
		${circle(1180, 430, 74, 'url(#coralGrad)')}
		${circle(1180, 430, 74, 'none', `stroke="${C.gold}" stroke-width="4" opacity="0.75"`)}
		${spark(1180, 430, 26, C.cream, 0.9)}
		${dots(150, 160, 6, 4, 25, 3.5, C.navy, 0.16)}
		${panel(120, 250, 300, 190, 26)}
		${rect(158, 286, 96, 12, 6, C.navy, 'opacity="0.24"')}
		${bars(158, 330, 220, 70, [26, 44, 36, 58, 50], C.teal, 0.9)}
		${figura({ x: 420, y: 780, s: 1.5, body: C.navy, accent: C.gold })}
		${figura({ x: 610, y: 800, s: 1.3, body: C.blue, accent: C.coral })}
		${figura({ x: 790, y: 770, s: 1.6, body: C.coral, accent: C.cream })}
		${figura({ x: 960, y: 795, s: 1.25, body: C.navy2, accent: C.gold })}
		${path('M430 660 Q700 560 1050 560', 'none', `stroke="${C.coral}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"`)}
		${path('M620 690 Q800 640 1060 620', 'none', `stroke="${C.gold}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"`)}
		${path('M800 660 Q930 620 1070 590', 'none', `stroke="${C.teal}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"`)}
		${circle(700, 560, 9, C.gold)}
		${circle(880, 605, 8, C.coral)}
		${rect(1330, 720, 150, 10, 5, C.navy, 'opacity="0.16"')}
		${rect(1330, 746, 96, 10, 5, C.navy, 'opacity="0.1"')}
		`,
	);
}

function blogLiderazgo() {
	const { w, h } = blogSize;
	return doc(
		w,
		h,
		`
		${rect(0, 0, 780, h, 0, C.navy)}
		${rect(0, 0, 780, h, 0, 'url(#navyGrad)', 'opacity="0.85"')}
		${dots(90, 610, 7, 4, 26, 3.5, C.cream, 0.14)}
		${rect(90, 130, 130, 14, 7, C.cream, 'opacity="0.28"')}
		${rect(90, 162, 84, 10, 5, C.cream, 'opacity="0.16"')}
		${bars(90, 250, 320, 300, [34, 58, 46, 76, 62, 92], 'url(#tealGrad)', 0.9)}
		${lineChart(90, 250, 320, 300, [22, 50, 42, 70, 58, 96], C.gold, 7)}
		${circle(560, 250, 86, 'none', `stroke="${C.cream}" stroke-width="2" opacity="0.18"`)}
		${circle(560, 250, 128, 'none', `stroke="${C.cream}" stroke-width="2" opacity="0.1"`)}
		${donut(560, 250, 66, 20, [
			{ value: 0.55, color: C.coral },
			{ value: 0.45, color: C.gold },
		])}
		${rect(500, 400, 120, 12, 6, C.cream, 'opacity="0.26"')}
		${rect(500, 428, 78, 10, 5, C.cream, 'opacity="0.14"')}
		${circle(1050, 230, 150, C.gold, 'opacity="0.3"')}
		${arcs(1090, 430, [120, 190, 260], C.coral, 2, 0.25)}
		${figura({ x: 1000, y: 760, s: 1.8, body: C.navy, accent: C.coral })}
		${figura({ x: 1260, y: 790, s: 1.5, body: C.coral, accent: C.gold })}
		${figura({ x: 1430, y: 780, s: 1.6, body: C.blue, accent: C.cream })}
		${path('M790 520 Q1050 330 1380 470', 'none', `stroke="${C.gold}" stroke-width="3" opacity="0.6"`)}
		${path('M800 570 Q1080 430 1390 560', 'none', `stroke="${C.coral}" stroke-width="2" stroke-dasharray="6 10" opacity="0.45"`)}
		${circle(1070, 393, 10, C.gold)}
		${circle(1240, 398, 8, C.coral)}
		${spark(830, 250, 22, C.coral, 0.85)}
		`,
	);
}

function blogDocencia() {
	const { w, h } = blogSize;
	return doc(
		w,
		h,
		`
		${circle(1410, 150, 260, C.gold, 'opacity="0.22"')}
		${dots(1070, 560, 8, 4, 26, 3.5, C.navy, 0.14)}
		${panel(130, 120, 760, 430, 30, 'url(#navyGrad)', 'rgba(255,255,255,0.09)')}
		${rect(180, 170, 170, 14, 7, C.cream, 'opacity="0.35"')}
		${bars(180, 250, 250, 220, [40, 60, 48, 80, 66, 94], 'url(#coralGrad)', 0.95)}
		${lineChart(180, 250, 250, 220, [28, 54, 44, 72, 62, 92], C.gold, 6)}
		${donut(640, 330, 82, 26, [
			{ value: 0.4, color: C.teal },
			{ value: 0.35, color: C.gold },
			{ value: 0.25, color: C.coral },
		])}
		${circle(640, 330, 42, C.navy)}
		${rect(560, 460, 240, 12, 6, C.cream, 'opacity="0.24"')}
		${rect(560, 488, 170, 10, 5, C.cream, 'opacity="0.14"')}
		${figura({ x: 470, y: 800, s: 1.8, body: C.navy, accent: C.coral, arm: 'point' })}
		${busto({ x: 1100, y: 660, s: 1.25, body: C.blue, accent: C.gold })}
		${busto({ x: 1255, y: 656, s: 1.2, body: C.coral, accent: C.cream })}
		${busto({ x: 1400, y: 662, s: 1.3, body: C.navy2, accent: C.teal })}
		${rect(1030, 660, 470, 16, 8, C.paper, 'stroke="rgba(22,35,63,0.12)" stroke-width="2"')}
		${rect(1060, 676, 18, 150, 6, C.navy, 'opacity="0.18"')}
		${rect(1460, 676, 18, 150, 6, C.navy, 'opacity="0.18"')}
		${rect(1130, 638, 70, 8, 4, C.gray)}
		${rect(1290, 634, 60, 8, 4, C.gray)}
		${circle(1440, 630, 10, C.gold, 'opacity="0.8"')}
		${path('M950 230 Q1040 280 1090 400', 'none', `stroke="${C.coral}" stroke-width="3" stroke-dasharray="6 10" opacity="0.45"`)}
		${spark(1010, 250, 18, C.coral, 0.9)}
		`,
	);
}

function blogTalentoDigital() {
	const { w, h } = blogSize;
	return doc(
		w,
		h,
		`
		${circle(1290, 210, 190, 'url(#glow)')}
		${dots(1100, 620, 8, 4, 26, 3.5, C.navy, 0.16)}
		${arcs(1250, 620, [150, 230, 310], C.teal, 2, 0.22)}
		${figura({ x: 420, y: 780, s: 1.8, body: C.navy, accent: C.coral })}
		${rect(330, 640, 300, 20, 10, C.navy, 'opacity="0.16"')}
		${rect(360, 660, 20, 120, 8, C.navy, 'opacity="0.2"')}
		${rect(580, 660, 20, 120, 8, C.navy, 'opacity="0.2"')}
		${panel(470, 470, 210, 150, 18, C.paper)}
		${rect(500, 500, 60, 8, 4, C.navy, 'opacity="0.3"')}
		${lineChart(500, 520, 140, 70, [20, 40, 34, 58, 70], C.teal, 4)}
		${rect(370, 610, 220, 18, 9, C.navy)}
		${rect(360, 628, 240, 12, 6, C.navy2)}
		${rect(820, 690, 150, 150, 28, 'url(#tealGrad)')}
		${rect(990, 590, 150, 250, 28, C.cream, 'stroke="rgba(22,35,63,0.12)" stroke-width="2"')}
		${rect(1160, 480, 150, 360, 28, 'url(#coralGrad)')}
		${rect(1330, 350, 150, 490, 28, C.navy)}
		${bars(850, 730, 90, 80, [30, 50, 70], C.cream, 0.85)}
		${circle(1065, 650, 34, 'none', `stroke="${C.teal}" stroke-width="5"`)}
		${circle(1065, 650, 12, C.teal)}
		${path('M1185 665 l24 24 -24 24 -24 -24 Z', C.cream)}
		${circle(1405, 420, 24, C.gold)}
		${circle(1405, 500, 24, C.teal)}
		${circle(1405, 580, 24, C.coral)}
		${figura({ x: 1080, y: 590, s: 1.15, body: C.navy2, accent: C.gold, arm: 'point' })}
		${figura({ x: 1330, y: 350, s: 1, body: C.navy, accent: C.coral })}
		${path('M600 300 Q880 180 1220 300', 'none', `stroke="${C.coral}" stroke-width="3" stroke-dasharray="4 12" opacity="0.5"`)}
		${spark(700, 300, 22, C.coral, 0.9)}
		${spark(950, 220, 16, C.gold, 0.9)}
		`,
	);
}

function proyectoMapaTalento() {
	const { w, h } = projectSize;
	const nodes = [
		[800, 320, 34, C.gold],
		[470, 360, 28, C.navy],
		[1120, 370, 30, C.coral],
		[300, 600, 26, C.teal],
		[640, 560, 24, C.navy],
		[980, 560, 28, C.gold],
		[1290, 620, 26, C.navy],
		[470, 810, 24, C.coral],
		[830, 830, 30, C.teal],
		[1180, 860, 24, C.navy],
	];
	const links = [
		[0, 1],
		[0, 2],
		[1, 3],
		[1, 4],
		[2, 5],
		[2, 6],
		[4, 7],
		[4, 8],
		[5, 8],
		[5, 9],
	];
	return doc(
		w,
		h,
		`
		${circle(1340, 190, 230, C.gold, 'opacity="0.2"')}
		${arcs(800, 560, [300, 420, 540], C.navy, 2, 0.12)}
		${dots(170, 820, 6, 4, 26, 3.5, C.navy, 0.15)}
		${links
			.map(
				([a, b]) =>
					`<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${C.navy}" stroke-width="3" opacity="0.28"/>`,
			)
			.join('')}
		${links
			.map(
				([a, b]) =>
					`<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${C.teal}" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.5"/>`,
			)
			.join('')}
		${nodes
			.map(([x, y, r, color], index) =>
				index === 0
					? `${circle(x, y, r + 22, color, 'opacity="0.18"')}${circle(x, y, r, color)}${circle(x, y, r - 12, C.paper)}${rect(x - 8, y - 4, 16, 20, 6, color)}${circle(x, y - 12, 7, color)}`
					: `${circle(x, y, r + 14, color, 'opacity="0.12"')}${circle(x, y, r, color)}${circle(x, y, r - 10, C.paper)}${circle(x, y - 4, 6, color)}${path(`M${x - 11} ${y + 10} Q${x} ${y - 2} ${x + 11} ${y + 10} Z`, color)}`,
			)
			.join('')}
		${panel(560, 120, 480, 120, 22, C.paper)}
		${rect(600, 152, 110, 12, 6, C.navy, 'opacity="0.28"')}
		${bars(600, 180, 210, 36, [22, 40, 34, 52, 46], C.teal, 0.9)}
		${circle(960, 180, 26, C.coral)}
		${spark(960, 180, 10, C.cream, 0.9)}
		${rect(830, 940, 180, 10, 5, C.navy, 'opacity="0.12"')}
		`,
	);
}

function proyectoEscuelaLiderazgo() {
	const { w, h } = projectSize;
	return doc(
		w,
		h,
		`
		${circle(1310, 180, 220, C.teal, 'opacity="0.18"')}
		${dots(160, 180, 6, 4, 26, 3.5, C.navy, 0.15)}
		${panel(180, 120, 620, 380, 28, 'url(#navyGrad)', 'rgba(255,255,255,0.08)')}
		${rect(230, 170, 150, 14, 7, C.cream, 'opacity="0.34"')}
		${bars(230, 250, 250, 180, [36, 58, 46, 76, 64, 90], 'url(#coralGrad)', 0.9)}
		${lineChart(230, 250, 250, 180, [26, 52, 44, 70, 60, 92], C.gold, 6)}
		${donut(650, 330, 70, 22, [
			{ value: 0.5, color: C.teal },
			{ value: 0.3, color: C.gold },
			{ value: 0.2, color: C.coral },
		])}
		${circle(650, 330, 36, C.navy)}
		${figura({ x: 500, y: 860, s: 2, body: C.navy, accent: C.coral, arm: 'point' })}
		${busto({ x: 850, y: 700, s: 1.4, body: C.blue, accent: C.gold })}
		${busto({ x: 990, y: 690, s: 1.35, body: C.coral, accent: C.cream })}
		${busto({ x: 1130, y: 695, s: 1.4, body: C.navy2, accent: C.teal })}
		${busto({ x: 1270, y: 705, s: 1.3, body: C.gold, accent: C.navy })}
		<ellipse cx="1060" cy="800" rx="340" ry="110" fill="${C.paper}" stroke="rgba(22,35,63,0.12)" stroke-width="3"/>
		<ellipse cx="1060" cy="792" rx="290" ry="74" fill="${C.gray}" opacity="0.45"/>
		${rect(900, 760, 110, 10, 5, C.navy, 'opacity="0.18"')}
		${rect(900, 746, 80, 10, 5, C.navy, 'opacity="0.12"')}
		${circle(1180, 760, 14, C.coral, 'opacity="0.85"')}
		${rect(1230, 758, 90, 8, 4, C.teal, 'opacity="0.7"')}
		${path('M800 480 Q1000 400 1250 500', 'none', `stroke="${C.coral}" stroke-width="3" stroke-dasharray="5 10" opacity="0.5"`)}
		${spark(1130, 330, 20, C.coral, 0.85)}
		${rect(850, 960, 300, 10, 5, C.navy, 'opacity="0.12"')}
		`,
	);
}

function proyectoRadarCultura() {
	const { w, h } = projectSize;
	return doc(
		w,
		h,
		`
		${circle(800, 520, 440, 'url(#navyGrad)')}
		${circle(800, 520, 440, 'none', `stroke="${C.navy}" stroke-width="2" opacity="0.2"`)}
		${arcs(800, 520, [140, 240, 340], C.teal, 2, 0.55)}
		${arcs(800, 520, [190, 290], C.coral, 1.5, 0.4)}
		<path d="M800 520 L1040 320 A340 340 0 0 1 1120 560 Z" fill="${C.teal}" opacity="0.14"/>
		<path d="M800 520 L560 660 A240 240 0 0 1 620 380 Z" fill="${C.coral}" opacity="0.12"/>
		${circle(800, 520, 12, C.cream)}
		${circle(960, 400, 12, C.gold)}
		${circle(690, 620, 10, C.coral)}
		${circle(1030, 600, 9, C.teal)}
		${circle(700, 410, 8, C.gold)}
		${dots(760, 470, 4, 4, 30, 2.5, C.cream, 0.3)}
		${figura({ x: 300, y: 800, s: 1.35, body: C.navy, accent: C.coral })}
		${figura({ x: 1300, y: 790, s: 1.35, body: C.coral, accent: C.gold })}
		${figura({ x: 1160, y: 840, s: 1.1, body: C.blue, accent: C.cream })}
		${panel(120, 150, 300, 170, 24, C.paper)}
		${rect(155, 185, 90, 12, 6, C.navy, 'opacity="0.26"')}
		${lineChart(155, 220, 230, 70, [20, 44, 36, 62, 54, 78], C.coral, 4)}
		${panel(1210, 180, 270, 150, 24, C.paper)}
		${circle(1260, 240, 30, C.teal, 'opacity="0.25"')}
		${bars(1300, 210, 140, 80, [30, 52, 44, 66], C.teal, 0.9)}
		${rect(1540, 980, 10, 10, 5, C.navy, 'opacity="0.1"')}
		`,
	);
}

function proyectoTalentoDigital() {
	const { w, h } = projectSize;
	return doc(
		w,
		h,
		`
		${circle(1330, 200, 230, 'url(#glow)')}
		${dots(170, 800, 6, 4, 26, 3.5, C.navy, 0.14)}
		${arcs(1180, 780, [170, 260, 350], C.teal, 2, 0.18)}
		${rect(180, 820, 240, 170, 26, C.navy)}
		${rect(440, 720, 240, 270, 26, C.cream, 'stroke="rgba(22,35,63,0.12)" stroke-width="2"')}
		${rect(700, 610, 240, 380, 26, 'url(#tealGrad)')}
		${rect(960, 490, 240, 500, 26, 'url(#coralGrad)')}
		${rect(1220, 360, 240, 630, 26, C.navy)}
		${bars(230, 870, 120, 70, [30, 50, 42, 66], C.cream, 0.85)}
		${circle(560, 780, 36, 'none', `stroke="${C.teal}" stroke-width="6"`)}
		${circle(560, 780, 14, C.teal)}
		${path('M820 680 l30 30 -30 30 -30 -30 Z', C.cream)}
		${circle(1080, 590, 28, C.cream)}
		${circle(1080, 590, 10, C.coral)}
		${circle(1340, 470, 26, C.gold)}
		${circle(1340, 550, 26, C.teal)}
		${circle(1340, 630, 26, C.coral)}
		${figura({ x: 300, y: 812, s: 1.2, body: C.navy, accent: C.coral, arm: 'point' })}
		${figura({ x: 560, y: 716, s: 1.22, body: C.navy2, accent: C.gold })}
		${figura({ x: 820, y: 606, s: 1.2, body: C.navy, accent: C.teal })}
		${figura({ x: 1080, y: 486, s: 1.15, body: C.coral, accent: C.cream })}
		${figura({ x: 1340, y: 356, s: 1.05, body: C.navy, accent: C.teal })}
		${path('M330 740 Q700 560 1260 300', 'none', `stroke="${C.coral}" stroke-width="3" stroke-dasharray="5 12" opacity="0.45"`)}
		${spark(700, 300, 22, C.coral, 0.9)}
		${spark(1040, 250, 15, C.gold, 0.9)}
		`,
	);
}

function perfilAbout() {
	const { w, h } = perfilSize;
	return doc(
		w,
		h,
		`
		${circle(700, 470, 415, 'url(#navyGrad)')}
		${circle(700, 470, 455, 'none', `stroke="${C.gold}" stroke-width="2.5" opacity="0.55"`)}
		${circle(700, 470, 505, 'none', `stroke="${C.teal}" stroke-width="1.5" opacity="0.35"`)}
		${circle(1100, 150, 150, C.coral, 'opacity="0.85"')}
		${circle(170, 730, 110, C.teal, 'opacity="0.3"')}
		${dots(150, 160, 6, 4, 26, 3.5, C.navy, 0.16)}
		${dots(1180, 700, 5, 4, 26, 3.5, C.navy, 0.16)}
		${arcs(150, 200, [60, 96, 132], C.navy, 2, 0.14)}
		${spark(1080, 230, 20, C.cream, 0.9)}
		${spark(300, 420, 14, C.coral, 0.8)}
		${retrato(700, 380, 1.05)}
		${panel(1120, 640, 200, 130, 20, C.paper)}
		${rect(1150, 668, 80, 10, 5, C.navy, 'opacity="0.24"')}
		${lineChart(1150, 696, 140, 46, [20, 36, 30, 48, 60], C.coral, 3)}
		${rect(120, 820, 160, 10, 5, C.navy, 'opacity="0.14"')}
		${rect(120, 846, 100, 10, 5, C.navy, 'opacity="0.1"')}
		`,
	);
}

// --- render ---------------------------------------------------------------

const imagenes = [
	['blog-people-analytics.webp', blogPeopleAnalytics(), blogSize],
	['blog-retencion.webp', blogRetencion(), blogSize],
	['blog-liderazgo-coaching.webp', blogLiderazgo(), blogSize],
	['blog-docencia-analytics.webp', blogDocencia(), blogSize],
	['blog-talento-digital.webp', blogTalentoDigital(), blogSize],
	['proyecto-mapatalento.webp', proyectoMapaTalento(), projectSize],
	['proyecto-escuela-liderazgo.webp', proyectoEscuelaLiderazgo(), projectSize],
	['proyecto-radar-cultura.webp', proyectoRadarCultura(), projectSize],
	['proyecto-talento-digital.webp', proyectoTalentoDigital(), projectSize],
	['perfil-about.webp', perfilAbout(), perfilSize],
];

for (const [nombre, svg, size] of imagenes) {
	await sharp(Buffer.from(svg))
		.resize(size.w, size.h)
		.webp({ quality: 88, effort: 5 })
		.toFile(join(outDir, nombre));
	console.log(`✓ ${nombre}`);
}

console.log(`\n${imagenes.length} imágenes generadas en src/assets/`);
