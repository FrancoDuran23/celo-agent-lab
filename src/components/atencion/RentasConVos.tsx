import { ArrowUpRight, UsersRound } from "lucide-react";
import { RENTAS_CON_VOS } from "../../data/contacto";
import { CtaBand } from "../home/CtaBand";
import { ButtonLink } from "../ui/Button";
import { NEW_TAB } from "./utils";

/** Programa de atención territorial, sobre el shader "aguayo" (único acento WebGPU de la página). */
export function RentasConVos() {
  // "Rentas con Vos" → "Rentas" + "con Vos" en serif itálica.
  const [primera, ...resto] = RENTAS_CON_VOS.titulo.split(" ");

  return (
    <div className="container-page">
      <CtaBand>
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-16">
          <div>
            <p className="eyebrow !text-crema-200/70">¿No hay una oficina cerca?</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {primera}
              {resto.length ? (
                <>
                  {" "}
                  <span className="font-serif font-normal tracking-normal text-ocre-300 italic">
                    {resto.join(" ")}.
                  </span>
                </>
              ) : null}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-crema-100/80">{RENTAS_CON_VOS.descripcion}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={RENTAS_CON_VOS.href} variant="light" size="lg">
                <UsersRound aria-hidden="true" />
                Conocé {RENTAS_CON_VOS.titulo}
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">{NEW_TAB}</span>
              </ButtonLink>
            </div>
          </div>
        </div>
      </CtaBand>
    </div>
  );
}
