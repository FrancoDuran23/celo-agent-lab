# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Vecinos (contribuyentes comunes):** people in Jujuy who pay the Impuesto Inmobiliario or need one specific procedure (libre deuda, plan de pagos, a turno). Many arrive on a phone, often from a search or a payment slip, with little technical familiarity. Their job: find the right procedure, pay, and know what is due, without visiting an office.
- **Profesionales y empresas:** contadores, gestores, escribanos, comercios and agentes de recaudación who come back often for Ingresos Brutos DDJJ, Convenio Multilateral, retention regimes, Sellos and certificates. Their job: get to the exact service fast, check due dates and regulations, and move on.

## Product Purpose

A front-end redesign **proposal** for the website of the Dirección Provincial de Rentas (DPR) de Jujuy (rentasjujuy.gob.ar), to be presented to the DPR / Gobierno de Jujuy as a modernization concept. It reorganizes the informational site around the user's task: find a procedure, pay, know the due dates, understand each tax, and get help. It is front-end only and does not process procedures: every action hands off to the official portals (informational site and the Clave Fiscal system at rentasjujuyonline.gob.ar).

Success: the DPR sees a credible, modern, accessible proposal that is clearly implementable; a vecino finds and starts their procedure in seconds; a professional reaches the exact service without detours.

## Positioning

The official provincial tax authority of Jujuy. Only the DPR can truthfully present the province's tax system (Ingresos Brutos, Inmobiliario, Sellos, Tasas, Derecho de Explotación de Minerales), its Clave Fiscal services, the Centro de Atención Omnicanal (0800-555-5599, WhatsApp 388 340-1111, TuBOT 24 h, centrodeatencion@rentasjujuy.gob.ar), Casa Central (Lavalle 55) and its delegaciones, and the "Rentas con Vos" territorial program.

## Operating Context

- Two official domains: the informational site (rentasjujuy.gob.ar) and the transactional system (rentasjujuyonline.gob.ar/cedulavirtual, login "Página de Autenticación", Clave Fiscal = CUIT + password issued by the DPR).
- Many services work without Clave Fiscal (pay/consult Inmobiliario by padrón or CUIT, IIBB constancia, Tasa de Justicia, exemption and alícuota lookups); others require it.
- Deadline-driven use: monthly IIBB anticipos, Monotributo Unificado, Inmobiliario anticipos; the yearly Calendario Impositivo (RG 1732/2025 for 2026).
- In-person attention requires Turnos web.
- Language: Spanish (Argentina), voseo.
- The Impuesto Automotor is municipal (Constitución de Jujuy, art. 215), not DPR: the product must redirect, not offer it.

## Capabilities and Constraints

- Stack (existing codebase): Vite + React 19 + TypeScript + Tailwind CSS 4, client-side routing (react-router), content as plain data in `src/data/*.ts` ready to be replaced by an API.
- **vgpu is mandatory** (explicit user requirement): WebGPU shader work built with vgpu, loaded lazily, paused offscreen, a still frame with reduced motion, and a static fallback where WebGPU is unavailable.
- Front-end only, deployable as a static SPA. No backend, no authentication, no real payments.
- Pages: Inicio, Trámites (search + filters), Impuestos (index + detail), Vencimientos (calendar + .ics), Atención (channels, offices, turnos), Normativa, Noticias, Centro de ayuda, 404, global search (/ or Ctrl+K).
- Undecided: official deployment target; whether the DPR would supply its own logo and imagery.

## Brand Commitments

- Names: "Dirección Provincial de Rentas" / "Rentas Jujuy"; dependency: Ministerio de Hacienda y Finanzas, Gobierno de Jujuy.
- The "propuesta de rediseño / prototipo no oficial" notice was removed at the user's request (toggle `SHOW_PROTOTYPE_NOTICE`, now false). Orientative data (vencimientos) must still say it is orientative.
- **Logo (supplied by the user, oct. 2026):** Rentas' official isologo is reused as provided, not redrawn (`public/brand/`: background removed outside the circle only; the supplied image is cropped at top and bottom). Colors sampled from it: #2581C6 → **#0068A3** (brand) → #00588C.
- Voice: clear, warm, public-service Spanish with voseo; no marketing fluff.
- **Visual direction (user decision, oct. 2026): the category standard, played straight at top craft.** No world of its own: a very clean, easy-to-understand public-service portal with refined UX/UI. Craft bar: the clarity of GOV.UK, the familiarity of argentina.gob.ar, the polish of a top-tier product. Earlier own-world explorations (Siete Colores strata, aguayo, serif-italic accents) are discarded and must not return.
- **Color and ground (user, oct. 2026):** Rentas' brand color is the logo's celeste-blue **#0068A3** on white (AA 6:1, used for links and primary buttons). The site is predominantly white (light), with a complete dark mode as well (light, dark and automatic). No dark hero bands, no earthy palette.
- vgpu stays (mandatory) as a very faint accent in service of the canon (a pale celeste light veil on the white home header), never as identity.

## Evidence on Hand

- Verified content (relevamiento oct. 2026) in `src/data/`: channels and offices (`contacto.ts`), portal links (`site.ts`), procedures (`tramites.ts`), taxes (`impuestos.ts`), regulations (`normativa.ts`), 2026 news (`noticias.ts`), help content (`ayuda.ts`).
- `src/data/vencimientos.ts` holds **orientative** dates derived from observed patterns, not the official resolution text; the UI must say so.
- Absent, never fabricate: official logo and photography, usage statistics, testimonials, amounts or percentages not in the data, office hours beyond Casa Central.

## Product Principles

1. **Task first.** Every screen answers "what do I need to do and where do I do it" before anything else.
2. **Fiscal truth.** Never invent dates, amounts, numbers or claims; mark orientative data as such and hand off to the official source.
3. **Two speeds.** Plain language and guidance for the vecino; direct, dense, scannable paths for the professional, on the same surfaces.
4. **Light everywhere.** Works on a low-end phone on mobile data; WebGPU is progressive enhancement, never a requirement.
5. **Implementable.** Decoupled front, plain data, standard patterns the DPR's team can adopt.

## Accessibility & Inclusion

Public-sector audience: WCAG 2.2 AA, full keyboard operation, screen-reader landmarks and announcements, `prefers-reduced-motion` respected, readable at 200% zoom and from 360px wide, and plain-language Spanish.
