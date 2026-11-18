# Julia Querevalu | Web personal

Web personal y estática creada con [Astro](https://astro.build/) y preparada para publicarse de forma gratuita en GitHub Pages.

URL pública prevista: **https://jqu2011.github.io/blog-astro/**

## Contenido del sitio

- **Inicio**: presentación profesional, áreas de trabajo y proyectos destacados.
- **Acerca de mí**: perfil, formación, docencia, coaching, consultoría y contacto.
- **Proyectos**: cuatro casos ilustrativos de People Analytics, formación y talento digital.
- **Blog**: cinco artículos propios sobre datos, liderazgo, docencia y retención.
- **Asistente flotante**: responde en el navegador sobre perfil, servicios, proyectos, blog y contacto, sin servicios externos ni claves.

Todos los textos están en español. Los proyectos y sus métricas son **ejemplos ilustrativos**: sustitúyelos por casos reales cuando los tengas.

Las ilustraciones (portadas, proyectos y retrato) se generan localmente con SVG y `sharp`; no dependen de bancos de imágenes ni de APIs externas.

## Comandos

Ejecuta los comandos desde la raíz del proyecto:

| Comando           | Acción                                                          |
| ----------------- | --------------------------------------------------------------- |
| `npm install`     | Instala las dependencias.                                       |
| `npm run dev`     | Servidor local en `http://localhost:4321/blog-astro/`.          |
| `npm run build`   | Genera el sitio final en `./dist/`.                             |
| `npm run preview` | Previsualiza la compilación (`http://localhost:4322/blog-astro/`). |
| `npm run check`   | Comprueba tipos y errores del proyecto.                         |
| `node scripts/generate-images.mjs` | Regenera las ilustraciones locales en `src/assets/`. |

## Estructura

```text
src/
├── assets/                 Imágenes del perfil, proyectos y artículos
├── components/             Cabecera, pie, metadatos, fecha y asistente
├── content/blog/           Entradas del blog (Markdown)
├── data/asistente.ts       Respuestas y disparadores del asistente
├── data/proyectos.ts       Datos de los proyectos del portafolio
├── layouts/                Plantilla de las entradas
├── pages/                  Páginas del sitio
└── styles/global.css       Estilos globales
```

## Personalizar

- **Datos generales y contacto**: `src/consts.ts`. El correo y LinkedIn ya están configurados y se usan también en el asistente.
- **Proyectos**: `src/data/proyectos.ts`.
- **Portada**: `src/pages/index.astro`.
- **Perfil**: `src/pages/about.astro`.
- **Navegación**: `src/components/Header.astro`.
- **Imágenes**: `src/assets/`. Para usar fotos reales, sustituye el archivo manteniendo el nombre y vuelve a compilar; Astro las optimiza automáticamente.
- **Ilustraciones**: `scripts/generate-images.mjs` (paleta, escenas y composición). Ejecuta `node scripts/generate-images.mjs` tras cambiar el diseño.
- **Asistente**: `src/data/asistente.ts` (respuestas y palabras clave) y `src/components/Asistente.astro` (interfaz).
- **Dominio y ruta**: `astro.config.mjs` (`site` y `base`). Deben coincidir con el nombre del repositorio.

## Asistente local

El botón **¿Hablamos?** abre un asistente que funciona íntegramente en el navegador:

- No llama a ninguna API, no usa claves y no envía datos a terceros.
- Funciona en GitHub Pages porque todo es HTML, CSS y JavaScript estáticos.
- Responde con la información de `src/data/asistente.ts`. Cada intención tiene `disparadores` (fragmentos en minúsculas y sin tildes) y una `respuesta`.
- Si no encuentra una coincidencia, muestra una respuesta de respaldo con el correo y el enlace al blog.

Para añadir un tema, duplica una intención y ajusta sus disparadores. Para enlazar una página, usa `href: '/proyectos/'` (se añade el `base` automáticamente) o `'@email'` / `'@linkedin'` para los datos de `src/consts.ts`.

## Escribir una entrada

1. Crea un archivo `.md` en `src/content/blog/`.
2. Añade la cabecera:

```md
---
title: 'Título de la entrada'
description: 'Resumen breve.'
pubDate: '2026-11-10'
heroImage: '../../assets/blog-people-analytics.webp'
---

Aquí empieza el contenido.
```

3. Astro genera la página automáticamente y la añade al listado, al RSS y al sitemap.

## Despliegue en GitHub Pages

El archivo `.github/workflows/deploy.yml` compila y publica el sitio en cada push a `main`, sin coste. En el repositorio hay que activar **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Antes de publicar conviene revisar que el repositorio sea público y que `npm run build` y `npm run check` terminen sin errores.
