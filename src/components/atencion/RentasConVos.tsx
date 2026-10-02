import { ArrowUpRight } from "lucide-react";
import { RENTAS_CON_VOS } from "../../data/contacto";
import { ButtonLink } from "../ui/Button";
import { SectionHeader } from "../ui/primitives";

/** Programa de atención territorial, para quien no tiene una oficina cerca. */
export function RentasConVos() {
  return (
    <section aria-labelledby="rentas-con-vos-titulo" className="border-y border-line bg-surface-2">
      <div className="container-page py-12 sm:py-14">
        <SectionHeader
          id="rentas-con-vos-titulo"
          title={RENTAS_CON_VOS.titulo}
          description={RENTAS_CON_VOS.descripcion}
          action={
            <ButtonLink to={RENTAS_CON_VOS.href} variant="secondary">
              Conocé {RENTAS_CON_VOS.titulo}
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          }
        />
      </div>
    </section>
  );
}
