import type { Tramite } from "../../data/types";
import { Badge, LinkList } from "../ui/primitives";
import { CANAL_LABEL } from "./related";

/** Trámites del impuesto (mismo formato y etiquetas que la guía de trámites). */
export function TramitesImpuesto({ tramites }: { tramites: Tramite[] }) {
  return (
    <LinkList
      columns={2}
      className="border-b border-line"
      items={tramites.map((t) => ({
        key: t.id,
        href: t.href,
        title: t.titulo,
        description: t.descripcion,
        meta: (
          <>
            {/* Canal = categoría, no estado: azul si se puede hacer en línea, neutro si es solo presencial. */}
            <Badge tone={t.canal === "presencial" ? "neutral" : "info"}>{CANAL_LABEL[t.canal]}</Badge>
            {t.requiereClave ? <Badge tone="info">Clave fiscal</Badge> : null}
            {t.impuesto === "general" ? <Badge>Para todos los impuestos</Badge> : null}
          </>
        ),
      }))}
    />
  );
}
