import { Link } from "react-router";
import { VENCIMIENTOS, VENCIMIENTOS_INFO } from "../../data/vencimientos";
import type { Impuesto } from "../../data/types";
import { countdownLabel, countdownTone, daysBetween, parseISODate, today } from "../../lib/dates";
import { Badge, SmartLink } from "../ui/primitives";

const MES = new Intl.DateTimeFormat("es-AR", { month: "short" });

/** Próximos vencimientos del impuesto (mismo formato que la portada), o un estado vacío que lleva al calendario. */
export function VencimientosImpuesto({ imp }: { imp: Impuesto }) {
  const hoy = today();
  const proximos = VENCIMIENTOS.filter((v) => v.impuesto === imp.slug && daysBetween(hoy, parseISODate(v.fecha)) >= 0)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5);

  if (!proximos.length) {
    return (
      <div className="border-t border-line pt-4">
        <p className="font-semibold text-ink">No hay vencimientos próximos cargados para este impuesto.</p>
        <p className="mt-1 text-ink-3">
          Revisá el{" "}
          <Link to="/vencimientos" className="link">
            calendario de vencimientos
          </Link>{" "}
          para ver todas las fechas del año.
        </p>
      </div>
    );
  }

  return (
    <>
      <ol className="border-b border-line">
        {proximos.map((v) => {
          const d = parseISODate(v.fecha);
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
                  <p className="font-semibold text-ink">{v.titulo}</p>
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
      {VENCIMIENTOS_INFO.ilustrativo ? (
        <p className="mt-3 text-sm text-ink-3">
          Fechas orientativas basadas en el Calendario Impositivo 2026 ({VENCIMIENTOS_INFO.norma}).{" "}
          <SmartLink to={VENCIMIENTOS_INFO.oficial} className="link">
            Ver el calendario oficial
          </SmartLink>
        </p>
      ) : null}
    </>
  );
}
