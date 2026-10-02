# Rentas Jujuy — nuevo front

Nuevo front para el sitio de la Dirección Provincial de Rentas de Jujuy ([rentasjujuy.gob.ar](https://www.rentasjujuy.gob.ar)). Es sólo front: no procesa trámites ni pagos; cada acción deriva al portal oficial (sitio informativo y sistema de Clave Fiscal en rentasjujuyonline.gob.ar).

Publicado en GitHub Pages: https://francoduran23.github.io/rentas/

## Correrlo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build estático en dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

Es una SPA (Vite + React 19 + TypeScript + Tailwind CSS 4 + react-router). Para publicarla en un hosting estático, configurá el fallback de rutas a `index.html`.

### GitHub Pages

```bash
npm run build:pages   # build con base /rentas/, 404.html (fallback de rutas) y .nojekyll
```

El contenido de `dist/` se publica en la rama `gh-pages` (Settings → Pages → Deploy from a branch → `gh-pages` / root). Para otro subdirectorio, usá `VITE_BASE=/otro/ npx vite build`.

## Qué incluye

- **Inicio**: buscador de trámites, accesos directos (Clave Fiscal, pagar el Inmobiliario, turnos), trámites más usados, próximos vencimientos, Centro de Atención, impuestos, trámites por perfil y novedades.
- **Trámites**: buscador con filtros por impuesto, perfil y canal (sincronizados con la URL).
- **Impuestos**: índice y detalle por impuesto (Ingresos Brutos, Inmobiliario, Sellos, Tasas, Minerales). El Impuesto Automotor es municipal y se deriva al municipio.
- **Vencimientos**: calendario mensual accesible por teclado, filtros y descarga `.ics`.
- **Atención**: canales del Centro de Atención Omnicanal, turnos, Casa Central y delegaciones, medios de pago.
- **Normativa**, **Noticias**, **Centro de ayuda** (primeros pasos, glosario, preguntas frecuentes) y **404**.
- Buscador global con `/` o `Ctrl/⌘ + K`, modo claro/oscuro/automático, foco de alta visibilidad.

## Diseño

El diseño se definió con [impeccable](https://impeccable.style):

- `PRODUCT.md` guarda la verdad del producto: usuarios, propósito, restricciones y principios.
- `.impeccable/surfaces/` guarda el contrato de dirección.
- La dirección elegida es **el estándar de un portal de servicios públicos, ejecutado al máximo**: sin mundo visual propio, muy limpio y fácil de entender.
- La paleta es predominantemente blanca, con tinta casi negra y el azul del logo de Rentas (#0068A3) como color de marca; el verde, el ámbar y el rojo se usan sólo para estados. Tiene modo claro, oscuro y automático.
- La tipografía es Public Sans, una sola familia con números tabulares.
- El foco sigue el patrón de GOV.UK.

Los tokens viven en `src/styles/index.css`. Las primitivas (`LinkList`, `Notice`, `Disclosure`, `PageIntro`, `Badge`, botones) están en `src/components/ui/`.

## Fondo en movimiento (vgpu + CSS)

La portada tiene una luz celeste que deriva despacio detrás del buscador: tres masas suaves en trayectorias lentas (ciclos de 26 a 47 s). Se dibuja con un shader propio (`src/shaders/luz.wgsl`) renderizado con [vgpu](https://vgpu.sh). Los encabezados de las páginas internas llevan una versión CSS más tenue del mismo velo.

- vgpu se carga con `import()` dinámico y queda fuera del bundle inicial (`src/gpu/runtime.ts`).
- Hay un solo `Gpu` y un solo `frameLoop`, y los Effects se reutilizan desde un pool.
- Se dibuja por debajo de la resolución de pantalla (0,75x; 0,5x en móvil) a 30 fps (24 en móvil): es luz difusa, no necesita más.
- Si el navegador sólo ofrece un adaptador de software, no se usa WebGPU (frenaría la página). Para probar el shader igual: `?gpu=forzar`.
- Sin WebGPU (o con adaptador de software) se ve el velo CSS: dos degradés radiales que se mueven sólo con `transform`.
- La animación se pausa fuera de pantalla y con la pestaña oculta. Con `prefers-reduced-motion` queda quieta.
- El texto del hero mantiene contraste AA sobre cualquier cuadro.
- El montaje se puede cancelar (StrictMode) y se maneja la pérdida de dispositivo.
- Los shaders se validan con `npx vgpu check src/shaders/*.wgsl`.

## Datos

Todo el contenido está en `src/data/*.ts` como objetos planos, listos para reemplazarse por una API. Se relevó de fuentes públicas (octubre de 2026):

- Partes de prensa y resoluciones de la DPR.
- Notas de prensa local.
- Fragmentos del sitio oficial.

Algunos datos siguen pendientes:

- **Vencimientos**: son **orientativos**. Se armaron a partir de patrones del Calendario Impositivo 2026 (RG 1732/2025) y la interfaz lo aclara. Hay que reemplazarlos por el calendario oficial antes de publicar.
- **Delegaciones y redes sociales**: se vieron sólo en fragmentos del sitio oficial. Hay que verificarlas antes de publicar.
- **Logo**: se usa el isologo oficial de Rentas tal como fue aportado (`public/brand/`), sólo con el fondo blanco quitado para que funcione en modo oscuro. La imagen original viene recortada arriba y abajo; si se consigue la versión completa, basta con reemplazar esos archivos. El azul #0068A3 del logo es el color de marca del sitio.
- **Aviso de prototipo**: está desactivado; se puede volver a mostrar con `SHOW_PROTOTYPE_NOTICE` en `src/data/site.ts`.
