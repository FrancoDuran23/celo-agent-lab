import { Link } from "react-router";
import clsx from "clsx";
import { TRAMITES } from "../../data/tramites";
import { IMPUESTOS } from "../../data/impuestos";
import { NOTICIAS } from "../../data/noticias";
import { VENCIMIENTOS, VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { CANALES } from "../../data/contacto";
import type { Perfil } from "../../data/types";
import { countdownLabel, countdownTone, daysBetween, formatFull, parseISODate, today } from "../../lib/dates";
import { Icon } from "../../lib/icons";
import { ArrowLink, Badge, LinkList, SectionHeader, SmartLink } from "../ui/primitives";

/** Correo con un único punto de corte, después de la "@". */
function BreakAtSign({ value }: { value: string }) {
  const at = value.indexOf("@");
  if (at <= 0) return <>{value}</>;
  return (
    <>
      {value.slice(0, at + 1)}
      <wbr />
      {value.slice(at + 1)}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Trámites más usados                                                 */
/* ------------------------------------------------------------------ */

export function TramitesFrecuentes() {
  const items = TRAMITES.filter((t) => t.destacado).slice(0, 6);
  return (
    <section aria-labelledby="frecuentes-titulo" className="container-page py-14 sm:py-16">
      <SectionHeader
        id="frecuentes-titulo"
        title="Trámites más usados"
        action={<ArrowLink to="/tramites">Ver todos los trámites</ArrowLink>}
      />
      <LinkList
        className="mt-6"
        columns={3}
        items={items.map((t) => ({ key: t.id, href: t.href, title: t.titulo, description: t.descripcion }))}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Próximos vencimientos + Centro de Atención                          */
/* ------------------------------------------------------------------ */

const MES = new Intl.DateTimeFormat("es-AR", { month: "short" });

export function VencimientosYAtencion() {
  const hoy = today();
  const proximos = VENCIMIENTOS.filter((v) => daysBetween(hoy, parseISODate(v.fecha)) >= 0)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 4);

  return (
    <section className="container-page grid grid-cols-[minmax(0,1fr)] gap-10 pb-14 sm:pb-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
      <div aria-labelledby="venc-titulo" className="min-w-0">
        <SectionHeader
          id="venc-titulo"
          title="Próximos vencimientos"
          action={<ArrowLink to="/vencimientos">Calendario completo</ArrowLink>}
        />
        {proximos.length ? (
          <ol className="mt-6 border-b border-line">
            {proximos.map((v) => {
              const d = parseISODate(v.fecha);
              const imp = IMPUESTOS.find((i) => i.slug === v.impuesto);
              return (
                <li key={v.fecha + v.titulo} className="flex items-start gap-4 border-t border-line py-3.5 sm:items-center">
                  <time dateTime={v.fecha} className="w-14 shrink-0 text-center leading-none">
                    <span className="block text-2xl font-bold tabular text-ink">{d.getDate()}</span>
                    <span className="mt-1 block text-xs font-semibold text-ink-3 uppercase">
                      {MES.format(d).replace(".", "")}
                    </span>
                  </time>
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      {imp ? (
                        <Link to={`/impuestos/${imp.slug}`} className="link font-semibold">
                          {v.titulo}
                        </Link>
                      ) : (
                        <p className="font-semibold text-ink">{v.titulo}</p>
                      )}
                      {v.detalle ? <p className="text-sm text-ink-3">{v.detalle}</p> : null}
                    </div>
                    <Badge tone={countdownTone(v.fecha, hoy)} className="mt-2 shrink-0 tabular sm:mt-0">
                      {countdownLabel(v.fecha, hoy)}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-6 text-ink-3">No hay vencimientos cargados para las próximas semanas.</p>
        )}
        {VENCIMIENTOS_INFO.ilustrativo ? (
          <p className="mt-3 text-sm text-ink-3">
            Fechas orientativas basadas en el Calendario Impositivo 2026 ({VENCIMIENTOS_INFO.norma}).{" "}
            <SmartLink to={VENCIMIENTOS_INFO.oficial} className="link">
              Ver el calendario oficial
            </SmartLink>
          </p>
        ) : null}
      </div>

      <aside aria-labelledby="ayuda-titulo" className="rounded-xl bg-surface-2 p-6 sm:p-7">
        <h2 id="ayuda-titulo" className="text-xl font-bold text-ink">
          ¿Necesitás ayuda?
        </h2>
        <p className="mt-1 text-ink-2">El Centro de Atención Omnicanal te atiende sin que vayas a una oficina.</p>
        <ul className="mt-5 grid gap-4">
          {CANALES.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Icon name={c.icon} className="mt-0.5 size-5 shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="text-sm text-ink-3">{c.nombre}</p>
                <SmartLink to={c.href} className="link font-semibold">
                  <BreakAtSign value={c.valor} />
                </SmartLink>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-line pt-4">
          <ArrowLink to="/atencion">Oficinas, horarios y turnos</ArrowLink>
        </div>
      </aside>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Impuestos                                                           */
/* ------------------------------------------------------------------ */

export function ImpuestosLista() {
  return (
    <section aria-labelledby="impuestos-titulo" className="border-y border-line bg-surface-2">
      <div className="container-page py-14 sm:py-16">
        <SectionHeader
          id="impuestos-titulo"
          title="Impuestos provinciales"
          description="Quiénes pagan, cómo se paga y qué trámites podés hacer en línea."
          action={<ArrowLink to="/impuestos">Ver todos</ArrowLink>}
        />
        <LinkList
          className="mt-6"
          columns={3}
          items={IMPUESTOS.map((i) => ({
            key: i.slug,
            href: `/impuestos/${i.slug}`,
            title: i.nombre,
            description: i.bajada,
          }))}
        />
        <p className="mt-6 text-sm text-ink-3">
          ¿Buscás la patente del auto? El Impuesto Automotor es municipal: se paga en el municipio donde está radicado el
          vehículo.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trámites según tu perfil (todo visible, sin pestañas)               */
/* ------------------------------------------------------------------ */

const PERFILES: { id: Perfil; label: string; descripcion: string }[] = [
  { id: "personas", label: "Personas", descripcion: "Inmobiliario, libre deuda, planes de pago y exenciones." },
  { id: "empresas", label: "Comercios y empresas", descripcion: "Ingresos Brutos, Sellos, certificados y retenciones." },
  { id: "profesionales", label: "Profesionales", descripcion: "Trámites para contadores, escribanos y gestores." },
  { id: "agentes", label: "Agentes de recaudación", descripcion: "Declaraciones juradas, alícuotas y regímenes." },
];

export function PorPerfil() {
  return (
    <section aria-labelledby="perfil-titulo" className="container-page py-14 sm:py-16">
      <SectionHeader id="perfil-titulo" title="Trámites según tu perfil" />
      <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
        {PERFILES.map((p) => (
          <li key={p.id} className="border-t border-line py-4">
            <Link to={`/tramites?perfil=${p.id}`} className="link text-[1.05rem] font-semibold">
              {p.label}
            </Link>
            <p className="mt-1 text-[0.95rem] text-ink-3">{p.descripcion}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Novedades                                                           */
/* ------------------------------------------------------------------ */

export function Novedades() {
  const items = [...NOTICIAS].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);
  if (!items.length) return null;
  return (
    <section aria-labelledby="noticias-titulo" className="border-t border-line">
      <div className="container-page py-14 sm:py-16">
        <SectionHeader
          id="noticias-titulo"
          title="Novedades"
          action={<ArrowLink to="/noticias">Todas las noticias</ArrowLink>}
        />
        <ul className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {items.map((n) => (
            <li key={n.slug} className={clsx("border-t border-line pt-4")}>
              <p className="text-sm text-ink-3">
                <time dateTime={n.fecha}>{formatFull(n.fecha)}</time> · {n.categoria}
              </p>
              <h3 className="mt-1.5 text-lg leading-snug font-semibold">
                <SmartLink to={n.href ?? `/noticias#${n.slug}`} className="link text-ink decoration-transparent hover:decoration-current">
                  {n.titulo}
                </SmartLink>
              </h3>
              <p className="mt-1.5 line-clamp-3 text-[0.95rem] text-ink-3">{n.resumen}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
