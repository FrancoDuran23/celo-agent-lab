---
name: Rentas Jujuy
description: El estándar de un portal de servicios públicos, ejecutado al máximo; blanco, tinta casi negra y el azul del isologo de Rentas.
colors:
  # Modo claro (:root). Fuente normativa: src/styles/index.css
  brand: "#0068a3"
  brand-hover: "#00588c"
  brand-ink: "#ffffff"
  brand-soft: "#e6f1f8"
  bg: "#ffffff"
  surface: "#ffffff"
  surface-2: "#f4f6f9"
  surface-3: "#e9edf3"
  ink: "#0b0f19"
  ink-2: "#333a47"
  ink-3: "#565e6c"
  line: "#e1e6ee"
  line-strong: "#c4ccd8"
  ok: "#12733a"
  ok-soft: "#e7f4ec"
  warn: "#8a5300"
  warn-soft: "#fff3dd"
  danger: "#b42318"
  danger-soft: "#fdeceb"
  focus: "#ffd21f"
  focus-ink: "#0b0f19"
  # Modo oscuro ([data-theme="dark"] y prefers-color-scheme: dark): mismos roles.
  # focus y focus-ink no cambian entre modos.
  dark-brand: "#5cb3ea"
  dark-brand-hover: "#8dcaf1"
  dark-brand-ink: "#031a2b"
  dark-brand-soft: "#0d2a3f"
  dark-bg: "#0d1117"
  dark-surface: "#121821"
  dark-surface-2: "#171f2b"
  dark-surface-3: "#1f2937"
  dark-ink: "#eef2f7"
  dark-ink-2: "#c5ccd7"
  dark-ink-3: "#9ba4b3"
  dark-line: "#253041"
  dark-line-strong: "#364459"
  dark-ok: "#6fd39a"
  dark-ok-soft: "#12291c"
  dark-warn: "#f2bb5c"
  dark-warn-soft: "#2d2210"
  dark-danger: "#ff8e83"
  dark-danger-soft: "#2f1513"
typography:
  display:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "-0.015em"
  subhead:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  item-title:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.375
  lead:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.556
  link-title:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    lineHeight: 1.6
  body:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
  nav:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
  button:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
  label:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.429
  caption:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.333
  numeral:
    fontFamily: "'Public Sans Variable', 'Public Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "'tnum'"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  gutter: "1rem"
  gutter-sm: "1.5rem"
  gutter-lg: "2rem"
  container: "76rem"
  row: "1rem"
  column-gap: "2.5rem"
  section: "3.5rem"
  section-sm: "4rem"
  hero-lg: "5rem"
  intro: "2rem"
  intro-sm: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.brand-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: "2.75rem"
    padding: "0 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: "2.75rem"
    padding: "0 1.25rem"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
  button-subtle:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: "2.75rem"
    padding: "0 1.25rem"
  button-subtle-hover:
    backgroundColor: "{colors.surface-3}"
  button-sm:
    height: "2.25rem"
    padding: "0 0.875rem"
  button-lg:
    height: "3rem"
    padding: "0 1.5rem"
  icon-button:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.lg}"
    size: "2.5rem"
  icon-button-hover:
    backgroundColor: "{colors.surface-2}"
  input-hero-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    height: "3.25rem"
    padding: "0 1rem"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    height: "3rem"
    padding: "0 0.75rem 0 2.75rem"
  chip-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.full}"
    height: "2.25rem"
    padding: "0 0.875rem"
  chip-filter-hover:
    backgroundColor: "{colors.surface-2}"
  chip-filter-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  badge-neutral:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "0.125rem 0.5rem"
  badge-info:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand}"
  badge-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
  badge-warn:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.warn}"
  badge-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  notice-info:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  notice-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  notice-warn:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  notice-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  nav-link:
    textColor: "{colors.ink-2}"
    typography: "{typography.nav}"
    padding: "0 0.625rem"
  nav-link-active:
    textColor: "{colors.ink}"
  institutional-bar:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    height: "2.25rem"
  page-intro:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    padding: "3rem 0"
  help-aside:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.xl}"
    padding: "1.75rem"
  site-footer:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.body-sm}"
---

# Design System: Rentas Jujuy

## Overview

**Creative North Star: "El portal estándar, ejecutado al máximo"**

Este sistema no tiene mundo propio: es el canon de un portal de servicios públicos hecho con oficio. Tiene la claridad de GOV.UK, la familiaridad de argentina.gob.ar y la terminación de un producto de primer nivel. La pantalla es casi siempre blanca, el texto es tinta casi negra y hay un solo azul, el del isologo de Rentas, para lo que se puede tocar: enlaces y botón primario. El verde, el ámbar y el rojo aparecen sólo para comunicar estado. El modo oscuro es completo y espeja los mismos roles; no es una versión decorativa.

La densidad es la de una herramienta (modo Operate): listas con filetes de 1px, títulos que hablan solos, enlaces subrayados, números tabulares y nada que compita con la tarea. Todo lo que el sistema descarta es tan importante como lo que usa: no hay eyebrows, ni grillas de tarjetas iguales con ícono, ni sombras decorativas, ni glow, ni bandas oscuras de hero. Tampoco vuelven las exploraciones de mundo propio que se descartaron (estratos de Siete Colores, aguayo, acentos en serif itálica).

La única atmósfera es un velo de luz celeste, apenas visible, renderizado con vgpu (WebGPU) detrás del hero de inicio. Es un detalle al servicio del canon, nunca identidad: si no hay WebGPU, la página es exactamente igual sobre fondo liso.

**Key Characteristics:**
- Blanco primero, tinta #0b0f19, un solo azul de marca (#0068a3) y colores sólo para estado.
- Modo claro, oscuro y automático con los mismos roles semánticos.
- Una sola familia, Public Sans, en una escala fija de roles, con números tabulares donde hay cifras.
- Enlaces de texto siempre subrayados y foco amarillo de alta visibilidad (patrón GOV.UK).
- Separación con filetes de 1px y superficies tonales; sombra sólo en menús y diálogos.
- Radios de 8px en controles y de 12px en contenedores.
- Movimiento mínimo: cambios de color de 150ms y un fundido de 160ms con 4px de desplazamiento en menús y diálogos.

## Colors

La paleta es institucional y sobria: neutros fríos apenas azulados, un azul de marca con contraste AA y cuatro colores de estado con su fondo suave. Los componentes usan sólo los tokens semánticos (`--bg`, `--surface*`, `--ink*`, `--line*`, `--brand*`, estados, foco), expuestos a Tailwind como `bg-*`, `text-*`, `border-*` y `ring-*`. El modo oscuro redefine esos mismos tokens. Ningún componente pregunta en qué modo está, salvo en tres casos: el anillo que se agrega a menús y diálogos, el telón más oscuro del diálogo y el velo vgpu, que recibe sus colores por tema.

Las claves `dark-*` del frontmatter son los mismos roles en modo oscuro. Se aplican con `:root[data-theme="dark"]` o, sin elección guardada, con `prefers-color-scheme: dark`. El tema se guarda en `localStorage` (`rentas-theme`) y se aplica antes del primer render. El botón de tema alterna entre claro y oscuro; si la elección coincide con la del sistema, vuelve a automático.

### Primary
- **Azul Rentas** (#0068a3; oscuro #5cb3ea): es el azul del isologo oficial. Se usa en enlaces de texto, botón primario, borde activo de la navegación, día de hoy en el calendario, íconos de canales y cursor de texto. Contra blanco da 5,98:1 y contra `surface-2`, 5,53:1. En oscuro da 8,19:1 sobre el fondo.
- **Azul Rentas profundo** (#00588c; oscuro #8dcaf1): es el hover de enlaces y del botón primario. En claro oscurece y en oscuro aclara: siempre se aleja del fondo.
- **Tinta sobre marca** (#ffffff; oscuro #031a2b): es el texto sobre el botón primario. En oscuro el botón es celeste claro con texto casi negro (7,66:1).
- **Celeste agua** (#e6f1f8; oscuro #0d2a3f): es el fondo de los badges `info`, del aviso `info` y del resaltado de la noticia a la que se llega por ancla. El texto azul encima da 5,22:1.

### Neutral
- **Blanco** (`bg` y `surface`, #ffffff; oscuro #0d1117 y #121821): es el fondo de página y de paneles. En claro son el mismo blanco; en oscuro el panel sube un escalón.
- **Gris niebla** (`surface-2`, #f4f6f9; oscuro #171f2b): son las bandas tonales de la barra institucional, la cabecera de páginas internas (`PageIntro`), el footer, la banda de Impuestos en inicio, el aside de ayuda y los hovers.
- **Gris niebla profundo** (`surface-3`, #e9edf3; oscuro #1f2937): sólo es el hover del botón `subtle`.
- **Tinta** (`ink`, #0b0f19; oscuro #eef2f7): títulos y texto principal (19,15:1). También se usa como relleno del estado activo de chips y del día elegido en el calendario, con texto `bg` encima.
- **Grafito** (`ink-2`, #333a47; oscuro #c5ccd7): bajadas, cuerpo de avisos y acordeones, navegación en reposo y footer.
- **Pizarra** (`ink-3`, #565e6c; oscuro #9ba4b3): descripciones, metadatos, migas de pan, placeholders y borde de los campos de búsqueda. Da 6,54:1 sobre blanco, así que es apto para texto.
- **Filete** (`line`, #e1e6ee; oscuro #253041): es el divisor de 1px entre ítems, secciones, header y footer, y el borde de paneles.
- **Filete fuerte** (`line-strong`, #c4ccd8; oscuro #364459): anillo del botón secundario y de los chips inactivos, borde del buscador falso del header y de las teclas, hover del borde de la navegación y color de la barra de scroll. Da 1,62:1, así que no sirve como único límite de un campo.

### Estados
- **Verde** (`ok` #12733a sobre `ok-soft` #e7f4ec; oscuro #6fd39a sobre #12291c): confirmación, por ejemplo "copiado" o "agregado al calendario".
- **Ámbar** (`warn` #8a5300 sobre `warn-soft` #fff3dd; oscuro #f2bb5c sobre #2d2210): cuenta regresiva de un vencimiento a 7 días o menos, y resaltado de coincidencias en Normativa (ámbar al 22%).
- **Rojo** (`danger` #b42318 sobre `danger-soft` #fdeceb; oscuro #ff8e83 sobre #2f1513): errores. Un `Notice` de peligro lleva `role="alert"`.
- **Amarillo foco** (`focus` #ffd21f con `focus-ink` #0b0f19, iguales en ambos modos): es sólo el indicador de foco y el skip link. No tiene otro uso.

### Reservados
`--celeste` (#2581c6) es el celeste claro del isologo. Está declarado y mapeado a Tailwind, pero hoy ningún componente lo usa. Da 4,17:1 sobre blanco, así que, si se usa, es sólo para detalles sin texto. `--band`, `--band-ink`, `--band-ink-2` y `--visited` también están declarados y no tienen uso; no les asignes un rol sin decidirlo antes.

**La regla del azul único.** El azul de marca marca lo que se puede tocar (enlaces, botón primario) y lo que está activo (pestaña de navegación, hoy). No se usa como fondo de bandas, títulos ni decoración.

**La regla del color con significado.** El verde, el ámbar y el rojo sólo comunican estado, siempre con texto o ícono que diga lo mismo. Ninguna categoría (impuesto, tipo de norma) tiene un color propio. Hoy hay una excepción en el código: el badge de canal del trámite usa verde para "En línea" y para "En línea o presencial", y ámbar para "Presencial". Es una deuda conocida; no la repitas en piezas nuevas.

## Typography

**Display Font:** Public Sans Variable (con Public Sans, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** la misma familia
**Label/Mono Font:** la misma familia; los atajos de teclado (`kbd`) también usan Public Sans

**Character:** Es una sola sans pública, neutral y legible, pensada para gobierno. La jerarquía sale del tamaño y del peso (400, 500, 600 y 700), no de una segunda familia. Los títulos llevan `letter-spacing: -0.015em` y `text-wrap: balance`, y los párrafos `text-wrap: pretty`.

### Hierarchy
- **Display** (700, 3rem desde 640px y 2.25rem en móvil; interlineado 1 en escritorio y 1.2 en móvil): sólo el H1 del hero de inicio, "¿Qué necesitás hacer?".
- **Headline** (700, 2.5rem desde 640px y 1.875rem en móvil; 1.2): el H1 de páginas internas en `PageIntro` y el de la 404. Ancho máximo de 48rem.
- **Title** (700, 1.75rem desde 640px y 1.5rem en móvil; 1.333): el H2 de sección (`SectionHeader`).
- **Subhead** (700, 1.25rem; 1.4): títulos de asides y paneles, por ejemplo "¿Necesitás ayuda?". Para títulos de bloque más chicos ("Accesos directos", "Próximo vencimiento") baja a 1.125rem.
- **Item title** (600, 1.125rem; 1.375): títulos de noticias (H3) dentro de listas.
- **Lead** (400, 1.125rem; 1.556; `ink-2`): bajada del hero y de `PageIntro`, con un ancho máximo de 36 a 42rem.
- **Link title** (600, 1.05rem; 1.6): el enlace principal de cada ítem de `LinkList`, de los accesos directos y de los perfiles.
- **Body** (400, 1rem; 1.6): texto corrido. En lectura larga (Ayuda, detalle de impuesto, Normativa) la medida es de 68ch (`prose-measure`).
- **Body small** (400, 0.95rem; 1.6; `ink-3`): descripciones bajo cada enlace, footer y avisos.
- **Nav** (500, 0.95rem): navegación principal.
- **Button** (600, 0.95rem en el tamaño md): botones; 0.875rem en sm y 1rem en lg.
- **Label** (400 o 600, 0.875rem; 1.429): metadatos, migas, chips de filtro (500) y títulos de columna del footer (700, `ink`). La barra institucional usa 0.8rem.
- **Caption** (600, 0.75rem; 1.333): badges y el mes o día abreviado bajo una fecha, en mayúsculas. Es el único uso de mayúsculas del sistema.
- **Numeral** (700, 1.5rem; 1; tabular): el día del mes en las listas de vencimientos. El panel "Próximo vencimiento" lo lleva a 3.75rem (4.5rem desde 640px) con `letter-spacing: -0.03em`.

**La regla de las cifras tabulares.** Fechas, teléfonos, conteos, cuentas regresivas y números de paso llevan `.tabular` (`font-variant-numeric: tabular-nums`). La cifra se alinea y no salta al cambiar.

**La regla de la familia única.** No hay segunda familia, serif, itálica de acento ni monoespaciada. El archivo de itálica de Public Sans está importado, pero la interfaz no lo usa.

## Layout

Todo el contenido vive en `container-page`: ancho completo hasta 76rem, centrado, con márgenes laterales de 1rem, 1.5rem desde 640px y 2rem desde 1024px. A 1440px el contenedor mide 1216px, y descontando los márgenes quedan 1152px de contenido.

- **Breakpoints:** son los de Tailwind 4 (sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px), más 420px para mostrar la bajada del logo. La navegación completa aparece desde xl. Debajo hay un botón de menú, y entre md y xl la búsqueda se ve como un campo falso de 14rem en el header.
- **Grillas:** en móvil todo es una columna (`grid-cols-[minmax(0,1fr)]`). Las pistas siempre usan `minmax(0, …)` para que nada desborde. En escritorio se usan dos columnas asimétricas: contenido con aside de 20rem en el hero, 16rem en Noticias y 19rem en Normativa (xl); sidebar de 13rem (detalle de impuesto) o 15rem (Trámites); y proporciones de 1,5 a 1 (vencimientos y ayuda en inicio).
- **Listas en columnas:** `LinkList` pasa de 1 a 2 columnas (md) y a 3 (lg), con 2.5rem entre columnas. Cada ítem lleva un filete superior y 1rem de padding vertical. Los perfiles usan 4 columnas desde lg.
- **Ritmo vertical:** las secciones de inicio usan 3.5rem (4rem desde 640px). El hero usa 3rem, 4rem y 5rem (lg), y `PageIntro` usa 2rem (3rem desde 640px). Entre el encabezado de una sección y su contenido hay 1.5rem.
- **Columnas fijas:** los sidebars (filtros de Trámites, "En esta página", aside de Noticias) quedan fijos desde lg a 6rem o 7rem del borde superior. `scroll-padding-top` es de 5rem para que el header fijo no tape las anclas.
- **Medidas de lectura:** 68ch para prosa, 42rem para bajadas y descripciones de sección y 48rem para títulos de página.

**La regla del contenedor único.** Ningún bloque define su propio ancho máximo de página ni sus márgenes laterales: todo pasa por `container-page`. Las bandas tonales (`surface-2`) ocupan todo el ancho y el contenedor va adentro.

## Elevation & Depth

El sistema es plano. La profundidad se arma con tres recursos: filetes de 1px (`line`), bandas tonales de ancho completo (`surface-2`) y una sola sombra, reservada para lo que flota sobre la página. El header fijo agrega translucidez: fondo al 85% (95% sin soporte de `backdrop-filter`) con `blur(8px)`, separado por un filete. Las tarjetas no llevan sombra.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 12px 32px -8px rgb(var(--shadow-color) / 0.22), 0 2px 6px rgb(var(--shadow-color) / 0.08)`; `--shadow-color` vale `15 23 42` en claro y `0 0 0` en oscuro): el menú desplegable de Impuestos y el panel del buscador global. En oscuro se suma un anillo de 1px `line`, porque la sombra no se lee sobre fondo oscuro.
- **Telón del diálogo:** `ink` al 50% en claro y negro al 70% en oscuro.

**La regla de la sombra que flota.** La sombra sólo aparece en lo que está por encima de la página (menús y diálogos). Paneles, avisos, botones y tarjetas son planos: se separan con borde o con fondo tonal.

**La regla del sin glow.** No hay brillos, halos, degradés de color ni sombras de color. El velo vgpu del hero es la única luz del sistema.

## Shapes

Los bordes son suavemente curvos y siempre constantes por tipo de pieza:

- **8px** (`rounded.lg`): controles. Botones, campos, botones de ícono, ítems de menú y de resultados de búsqueda, y celdas del calendario.
- **12px** (`rounded.xl`): contenedores. Paneles, avisos, el aside de ayuda, el panel del buscador y el borde inferior del menú desplegable.
- **6px** (`rounded.md`): badges y teclas (`kbd`).
- **Píldora** (`rounded.full`): sólo chips de filtro (`aria-pressed`) y los círculos de número de paso (borde de 2px `ink`).
- **4px** (`rounded.sm`): el radio por defecto del anillo de foco, las teclas del header y los cuadraditos de la leyenda del calendario.

Las líneas son de 1px. Las excepciones de 2px son el campo de búsqueda del hero (`ink`), el de Normativa (`line-strong`), los círculos de paso, las celdas del calendario (donde el borde marca "hoy") y las marcas huecas del calendario. La navegación activa se marca con un borde inferior de 3px. Las marcas de impuesto en el calendario combinan forma y tono: círculo o cuadrado (2px de radio), lleno o hueco, y azul o grafito. Así el color nunca es la única diferencia.

## Components

### Buttons
Son sobrios y firmes: peso 600, sin sombra ni gradiente, y sólo cambian de color.
- **Shape:** 8px de radio, ícono a 1.1em con 0.5rem de separación y sin subrayado.
- **Primary:** fondo `brand` y texto `brand-ink`; en hover, `brand-hover`. Es una sola acción por bloque: "Ingresar con clave fiscal" en el header (tamaño sm, con ícono LogIn) o "Buscar".
- **Secondary:** fondo `surface`, texto `ink` y anillo interior de 1px `line-strong`; en hover, `surface-2`. Es la acción alternativa ("Agregar al calendario", "Línea gratuita").
- **Subtle:** fondo `surface-2`, texto `ink`; en hover, `surface-3`. Es una acción terciaria dentro de un panel.
- **Tamaños:** sm de 36px de alto (padding 0.875rem, 0.875rem de texto), md de 44px (1.25rem, 0.95rem) y lg de 48px (1.5rem, 1rem).
- **Hover / Focus:** transición de color de 150ms. El foco es el global: contorno amarillo de 3px más un anillo de 5px `focus-ink`. Deshabilitado: opacidad al 50% y sin eventos.
- **ButtonLink:** se ve igual, pero es un enlace. Las URL absolutas abren en una pestaña nueva y avisan "(se abre en una pestaña nueva)" para lectores de pantalla.
- **Icon button:** 40×40px, 8px de radio, `ink-2`, hover `surface-2`. Lo usan la búsqueda, el tema y el menú.

### Links
- **Texto:** `.link` es `brand` con subrayado de 1px al 45% de opacidad, offset de 0.18em. En hover pasa a `brand-hover`, con subrayado de 2px a color pleno (150ms).
- **ArrowLink:** acción secundaria de una sección ("Ver todos los trámites"). Es `.link` en 600 con un chevron derecho si es interna o una flecha diagonal si es externa.
- **Externos:** siempre muestran la flecha diagonal (ArrowUpRight) y el aviso de pestaña nueva para lectores de pantalla.
- **Foco:** el texto pasa a `focus-ink` sobre fondo `focus`, sin subrayado, con una barra inferior de 4px `focus-ink`. Es el patrón de GOV.UK.

### Chips (filtros)
- **Style:** píldora de 36px de alto, padding de 0.875rem, 0.875rem de texto en 500. En reposo: fondo `surface`, texto `ink-2` y anillo interior de 1px `line-strong`; en hover, `surface-2`.
- **State:** activo es fondo `ink` con texto `bg` (invertido) y `aria-pressed="true"`. El conteo va en 0.75rem tabular, `ink-3` (o `bg` al 75% si está activo). Se usan en Trámites, Vencimientos, Normativa, Noticias y Atención.

### Badges
- **Style:** 6px de radio, padding de 0.125rem por 0.5rem, 0.75rem en 600, ícono de 14px. Cada tono combina fondo suave con texto del mismo tono: `neutral` (`surface-2`/`ink-2`), `info` (`brand-soft`/`brand`), `ok`, `warn` y `danger`.
- **Uso:** son estado y categoría, nunca decoración. La cuenta regresiva de un vencimiento es `warn` a 7 días o menos y `neutral` en el resto de los casos. En los trámites, el impuesto va en `neutral` y "Clave fiscal" en `info`. El canal va en `ok` (en línea) o `warn` (presencial), que es la excepción anotada en Colors.

### Cards / Containers
- **Panel:** 12px de radio, borde de 1px `line`, fondo `surface` y sin sombra. El padding va de 1rem a 2rem según el contenido (lo típico es 1.5rem y 2rem desde 640px). Se usa para "Próximo vencimiento", el detalle del día y las normas clave. No hay grillas de paneles iguales con ícono.
- **Aside tonal:** 12px de radio, fondo `surface-2` sin borde y padding de 1.5rem (1.75rem desde 640px). Es el "¿Necesitás ayuda?" de inicio.
- **Notice:** fondo suave del tono, 12px de radio, padding de 1rem, ícono de 20px en el color del tono (Info, CircleCheck, TriangleAlert, CircleAlert), título en 600 y cuerpo en `ink-2` a 0.95rem. No lleva franja lateral.

### Lists
- **LinkList:** es el formato base para trámites, servicios e impuestos (patrón GOV.UK). Cada ítem tiene filete superior, 1rem de padding vertical, título `.link` a 1.05rem en 600 y descripción a 0.95rem `ink-3`, con badges opcionales debajo. Se arma en 1, 2 o 3 columnas.
- **Disclosure:** acordeón nativo (`details`/`summary`) con filete inferior. El resumen va en 600 `ink` (hover `brand`) con un chevron que gira 180°. El cuerpo va en `ink-2` con medida de 68ch.
- **Lista de vencimientos:** un bloque de fecha de 3.5rem de ancho (numeral más mes en caption, `ink-3`), título como enlace al impuesto, detalle en `label` y badge de cuenta regresiva. Debajo va siempre la nota de que las fechas son orientativas, con el enlace al calendario oficial.

### Inputs / Fields
- **Búsqueda del hero:** etiqueta visible en 600 arriba. El campo mide 52px de alto, con borde de 2px `ink`, fondo `surface` y 8px de radio sólo a la izquierda, pegado al botón primario "Buscar" (que es sólo ícono en móvil). Al enfocarse muestra el contorno amarillo de 3px, sin anillo oscuro, porque el borde de tinta cumple esa función.
- **Campo de búsqueda de página** (Trámites, Ayuda, 404, buscador global): 48px de alto (52px desde 640px en Trámites y Ayuda), borde de 1px `ink-3` y 8px de radio. Lleva lupa a la izquierda con 2.75rem de padding, salvo en la 404, que pone un botón primario lg al lado. El texto es de 1rem, o de 1.125rem desde 640px en Trámites, Ayuda y el buscador global.
- **Campo de Normativa:** es una variante con borde de 2px `line-strong` (hover `ink-3`). Ese borde da 1,62:1, por debajo del 3:1 que pide un límite de campo; para un campo nuevo usá el de página.
- **Checkbox:** el nativo, de 20px, con `accent-color` `brand`.
- **Placeholder:** `ink-3`. El cursor de texto es `brand`.

### Navigation
- **Barra institucional:** banda `surface-2` con filete inferior, de 36px de alto mínimo y 0.8rem en `ink-2`. A la izquierda dice "Gobierno de Jujuy · Ministerio de Hacienda y Finanzas". A la derecha (md o más) están la línea gratuita 0800 (tabular, 600), Turnos web, Noticias y Centro de ayuda, con subrayado en hover.
- **Header:** es fijo, de 64px de alto (72px desde lg). Contiene el logo, la navegación principal (Trámites, Impuestos, Vencimientos, Atención y Normativa), la búsqueda, el tema y el botón primario.
- **Enlace de navegación:** 0.95rem en 500 y `ink-2`, con un borde inferior de 3px transparente. En hover el borde pasa a `line-strong` y el texto a `ink`; activo, a `brand` con texto `ink`.
- **Desplegable (Impuestos):** panel de 22rem con radio inferior de 12px, sombra pop y padding de 0.5rem. Cada ítem tiene el nombre en 600 (`brand` en hover) y una descripción en 0.875rem `ink-3`, y al final va "Todos los impuestos". Se cierra con Esc, al hacer clic afuera, al perder el foco o al navegar.
- **Menú móvil** (debajo de xl): se despliega bajo el header. Tiene un disparador de búsqueda de 48px, ítems a 1.125rem en 600 separados por filetes (el activo en `brand`), los impuestos en 2 columnas y, al final, el botón primario lg y el secundario lg con la línea gratuita.
- **Migas de pan:** 0.875rem `ink-3`, con chevrons de 14px. Los enlaces son `.link` y la página actual va en `ink-2` con `aria-current`.
- **"En esta página":** lista de `.link` a 0.95rem. Desde lg, la sección activa va en 600 `ink` con subrayado de 2px `brand`.
- **Skip link:** "Saltar al contenido", en amarillo `focus` con texto `focus-ink` en 700, visible al recibir foco.

### Buscador global
Es un `dialog` modal nativo que se abre con "/" o Ctrl/⌘+K. El panel tiene 42rem de ancho y queda al 10% de la altura de la pantalla. Usa 12px de radio, sombra pop y el patrón combobox con listbox. La opción activa lleva fondo `surface-2`, título en `brand` y la pista ↵. Al pie, en `surface-2`, están los atajos en `kbd` (24px de alto, 6px de radio, borde `line-strong`) y "Ver todos los resultados". La cantidad de resultados se anuncia por `aria-live`.

### Logo
Es el isologo oficial aportado por Rentas, usado tal cual (PNG de 96px y de 180px para 2x, mostrado a 40×40px y con `alt` vacío porque el enlace lleva la etiqueta "Rentas Jujuy, ir al inicio"). A su lado van "Rentas Jujuy" a 1.05rem en 700 `ink` y "Dirección Provincial de Rentas" a 0.78rem `ink-3` (desde 420px). Aparece en el header y en el footer. `theme-color` es #0068a3.

### Velo de luz (vgpu) — componente distintivo
Es un shader WebGPU propio (`src/shaders/luz.wgsl`) que se renderiza con vgpu sólo detrás del hero de inicio. Arma un degradé vertical casi plano y le suma un velo de ruido fbm simplex de muy baja frecuencia, que deriva lento (tiempo × 0,03). El velo se concentra a la derecha, lejos del texto (máscara `smoothstep(0.15, 0.95, x)`), y lleva un grano de 0,006 para evitar el banding. Los colores llegan como uniforms según el tema, así el cambio de tema no recrea el canvas:

| Tema | Arriba | Abajo | Velo | Intensidad |
|---|---|---|---|---|
| Claro | #ffffff | #f4f9fd | #c7e3f7 | 0,75 |
| Oscuro | #0d1117 | #0f141b | #121c26 | 0,45 |

- **Carga:** vgpu se importa en forma dinámica y queda fuera del bundle inicial. No se descarga si `navigator.gpu` no existe o si está activo el ahorro de datos. Usa un solo dispositivo `low-power`, un solo `frameLoop` a 45 fps y un DPR entre 1 y 1,5.
- **Entrada:** primero se pinta el respaldo y el canvas aparece con un fundido de opacidad de 1000ms cuando el primer cuadro está listo. Con movimiento reducido no hay transición.
- **Pausa:** se pausa fuera de pantalla (con un margen de 256px), con la pestaña oculta y con `prefers-reduced-motion`. En ese último caso queda un cuadro fijo (t = 12s) y no se escucha el puntero.
- **Puntero:** sin movimiento reducido, el velo se corre como máximo un 2,5% del ancho siguiendo al puntero, con suavizado.
- **Respaldo:** sin WebGPU, o si se pierde el dispositivo, queda el fondo liso `bg`. Es decorativo: `aria-hidden` y sin eventos de puntero.

**La regla del velo invisible.** El velo tiene que pasar casi inadvertido. Si alguien lo nota antes que el buscador, sobra intensidad. Vive sólo en el hero de inicio, nunca detrás de texto que dependa de él y nunca como identidad.

### Movimiento
- **Colores:** 150ms en botones, enlaces, navegación, chips y celdas (100ms en las opciones del buscador).
- **Menús y diálogos:** entrada `pop-in` de 160ms con `cubic-bezier(0.22, 1, 0.36, 1)` (opacidad de 0 a 1 y desplazamiento de −4px a 0). Se anula con movimiento reducido.
- **Chevrons:** giro de 180° al abrir acordeones y el desplegable.
- **Desplazamiento:** scroll suave en la página; automático con movimiento reducido.

**La regla del movimiento que informa.** Nada se anima para lucirse: sólo cambian colores de estado y aparecen piezas que flotan. Toda animación tiene su versión con `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** usá sólo tokens semánticos (`bg`, `surface*`, `ink*`, `line*`, `brand*`, `ok`/`warn`/`danger` y sus `-soft`, `focus`) a través de las utilidades de Tailwind; el modo oscuro se resuelve solo.
- **Do** reservá `brand` (#0068a3 / #5cb3ea) para enlaces, el botón primario y los indicadores de "activo" o "hoy".
- **Do** subrayá todo enlace de texto con `.link` (1px al 45%; 2px a color pleno en hover).
- **Do** dejá el foco global intacto: contorno amarillo #ffd21f de 3px con anillo #0b0f19 de 5px en controles, y fondo amarillo con barra inferior oscura en enlaces.
- **Do** armá trámites, servicios e impuestos como `LinkList`, con filetes de 1px y descripción, en 1 a 3 columnas.
- **Do** usá 8px de radio en controles, 12px en contenedores, 6px en badges y píldora sólo en chips de filtro.
- **Do** poné `.tabular` en fechas, teléfonos, conteos y cuentas regresivas.
- **Do** rotulá como orientativo todo dato que no sea oficial (vencimientos) y enlazá a la fuente oficial.
- **Do** marcá los enlaces externos con la flecha diagonal y el aviso "(se abre en una pestaña nueva)".
- **Do** pasá todo por `container-page` (76rem; márgenes de 1rem, 1.5rem y 2rem) y usá `minmax(0, …)` en las pistas de grilla.
- **Do** diferenciá categorías con forma más tono, como las marcas del calendario, nunca sólo con color.

### Don't:
- **Don't** uses eyebrows ni rótulos sobre los títulos: `SectionHeader` y `PageIntro` ignoran ese prop.
- **Don't** armes grillas de tarjetas iguales con ícono para trámites o servicios.
- **Don't** pongas sombras fuera de menús y diálogos, ni glow, halos o degradés de color.
- **Don't** uses bandas oscuras o azules de hero, ni una paleta terrosa, ni las exploraciones descartadas (estratos de Siete Colores, aguayo, acentos en serif itálica).
- **Don't** escribas texto en `--celeste` (#2581c6, 4,17:1 sobre blanco) ni en `line-strong`.
- **Don't** uses las variantes de botón `inverse` e `inverse-outline`: son un resto de la banda azul descartada y no tienen uso.
- **Don't** redibujes, recolorees ni encuadres de otra forma el isologo oficial, y no lo pongas sobre fondos de color.
- **Don't** sumes una segunda familia tipográfica, ni itálicas o versalitas de acento.
- **Don't** lleves el velo vgpu fuera del hero de inicio, ni le subas la intensidad, ni lo hagas imprescindible: la página tiene que verse igual sin WebGPU.
- **Don't** animes nada que no sea un cambio de estado o la aparición de un menú o diálogo, y nunca sin su versión con movimiento reducido.
