---
version: 1
slug: "src-pages-homepage-tsx"
primary_target: "src/pages/HomePage.tsx"
related_targets: ["src/App.tsx"]
---

## Scope

Whole site (Inicio and every interior route). Visitor mode: **Operate** (the visitor completes a task: find a procedure, pay, check due dates, get help). Read-mode passages: Ayuda, Normativa, impuesto detail.

## Audience and task

Vecinos and profesionales, weighted equally (PRODUCT.md). First job on Inicio: **find and start** a procedure; then see what is due. Proof/content: verified data in src/data. Constraints: vgpu mandatory (in service of the canon, never identity), front-end only. User (oct. 2026) asked for backgrounds that move, slightly and smoothly, for a professional feel.

## Direction contract

THESIS: A canonical public-service portal at top craft: the task first, zero ornament, everything legible at a glance. It refuses an own world (strata, textile, serif-italic accents, eyebrow labels) and refuses the generic grid of same-size icon-tile cards.

OWN-WORLD: Canon, not a world. Predominantly white grounds with near-black ink; Rentas' celeste as the brand color (an AA-safe celeste-blue for links and primary buttons, pure celeste only on surfaces without text); green, amber and red only for state; full dark mode mirroring the same roles. High-visibility focus (yellow fill, dark underline). One family, Public Sans, on a fixed role scale with tabular numerals. Underlined links, 1px rules as separation, 8px control radius, 12px panel radius, no shadows except menus and dialogs.

STORY: The vecino knows in one second where to search and what is due; the professional reaches the Clave Fiscal service in one click; both trust it because it is plain, consistent and official in tone.

FIRST VIEWPORT: Thin institutional bar (Gobierno de Jujuy, 0800) over a white header (name, navigation, "Ingresar con clave fiscal"). Below, a white header area (soft pale-celeste light drifting slowly on the right — on portrait phones top-right and behind the access list — vgpu shader, CSS veil fallback) with H1 "¿Qué necesitás hacer?" left, a large bordered search field and "Más buscados" links, and "Accesos directos" as a plain three-link list on the right. Directly under it: "Trámites más usados" as six links in three columns, then "Próximos vencimientos" beside the Centro de Atención.

FORM: Canon standing exit chosen by the user over the assigned direction (candidate 3 of 7, "Salinas Grandes"); seed key c3bce641. Signature interaction: instant search (field and Ctrl+K / "/" dialog). Motion grammar: short fades and 4px translates on menus and dialogs only; the background light drifts on slow Lissajous paths (26–47 s cycles; perceptible if you look, calm if you don't), the same light in CSS drifts in every inner-page header band, and everything freezes with reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Official logo supplied by the user and used as provided (the supplied image is cropped at top and bottom; swap in a complete version if one appears). The "prototipo no oficial" notice was removed at the user's request. Real vencimientos from RG 1732/2025 still pending (dates stay labeled orientative).
