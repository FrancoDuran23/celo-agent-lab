import { Link } from "react-router";
import { ArrowRight, CalendarClock } from "lucide-react";
import clsx from "clsx";
import { VENCIMIENTOS, VENCIMIENTOS_INFO } from "../../data/vencimientos";
import { IMPUESTOS } from "../../data/impuestos";
import { CANALES } from "../../data/contacto";
import { daysBetween, parseISODate, relativeDays, today } from "../../lib/dates";
import { Icon } from "../../lib/icons";
import { Card, SmartLink } from "../ui/primitives";

const MONTH = new Intl.DateTimeFormat("es-AR", { month: "short" });

export function VencimientosAyuda() {
  const hoy = today();
  const proximos = VENCIMIENTOS.filter((v) => daysBetween(hoy, parseISODate(v.fecha)) >= 0)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5);

  return (
    <section aria-labelledby="venc-titulo" className="py-20 sm:py-24">
      <div className="container-page grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Próximos vencimientos */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Agenda fiscal</p>
              <h2 id="venc-titulo" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Próximos vencimientos
              </h2>
            </div>
            <Link
              to="/vencimientos"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft"
            >
              Calendario completo <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          {proximos.length ? (
            <ol className="mt-6 divide-y divide-line">
              {proximos.map((v) => {
                const d = parseISODate(v.fecha);
                const imp = IMPUESTOS.find((i) => i.slug === v.impuesto);
                const dias = daysBetween(hoy, d);
                return (
                  <li key={v.fecha + v.titulo} className="flex items-center gap-4 py-4">
                    <div
                      className={clsx(
                        "flex size-14 shrink-0 flex-col items-center justify-center rounded-xl ring-1",
                        dias <= 7 ? "bg-brand-soft text-brand ring-brand/20" : "bg-surface-2 text-ink ring-line",
                      )}
                    >
                      <span className="text-xl leading-none font-semibold tabular">{d.getDate()}</span>
                      <span className="mt-0.5 text-[0.68rem] font-medium tracking-wide uppercase">
                        {MONTH.format(d).replace(".", "")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{v.titulo}</p>
                      <p className="mt-0.5 truncate text-sm text-ink-3">
                        {imp?.nombre ?? v.impuesto}
                        {v.detalle ? ` · ${v.detalle}` : ""}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                        dias <= 7 ? "bg-brand text-brand-ink" : "bg-surface-2 text-ink-2",
                      )}
                    >
                      {relativeDays(v.fecha, hoy)}
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-6 flex items-center gap-3 rounded-xl bg-surface-2 p-4 text-ink-3">
              <CalendarClock className="size-5" aria-hidden="true" />
              No hay vencimientos cargados para las próximas semanas.
            </p>
          )}
          {VENCIMIENTOS_INFO.ilustrativo ? (
            <p className="mt-4 text-xs leading-relaxed text-ink-3">
              Fechas orientativas basadas en el Calendario Impositivo 2026 ({VENCIMIENTOS_INFO.norma}). Confirmalas en el{" "}
              <a href={VENCIMIENTOS_INFO.oficial} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                calendario oficial
              </a>
              .
            </p>
          ) : null}
        </Card>

        {/* Canales de ayuda */}
        <div className="relative overflow-hidden rounded-2xl bg-night-900 p-6 text-crema-50 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(224_166_59/0.35),transparent_65%)]"
          />
          <p className="eyebrow mb-2 !text-crema-200/70">Centro de Atención Omnicanal</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">¿Necesitás ayuda?</h2>
          <p className="mt-2 max-w-sm text-crema-100/75">
            Hablá con una persona por teléfono, WhatsApp o chat, sin ir a una oficina.
          </p>
          <ul className="relative mt-6 grid gap-2">
            {CANALES.slice(0, 4).map((c) => (
              <li key={c.id}>
                <SmartLink
                  to={c.href}
                  className="group flex items-center gap-4 rounded-xl bg-white/6 p-3.5 ring-1 ring-white/10 transition-colors hover:bg-white/12"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-ocre-300">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-crema-200/70">{c.nombre}</span>
                    <span className="block truncate font-semibold text-crema-50">{c.valor}</span>
                  </span>
                  <ArrowRight
                    className="size-4 text-crema-200/50 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </SmartLink>
              </li>
            ))}
          </ul>
          <Link
            to="/atencion"
            className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ocre-300 hover:underline"
          >
            Ver oficinas y horarios <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
