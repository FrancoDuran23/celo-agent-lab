import type { Pregunta } from "../../data/types";
import { Disclosure } from "../ui/primitives";

/** Preguntas frecuentes con <details>/<summary> nativos (teclado y lectores de pantalla sin JS). */
export function Faq({ preguntas }: { preguntas: Pregunta[] }) {
  return (
    <div className="border-t border-line">
      {preguntas.map((q, i) => (
        <Disclosure key={q.pregunta} summary={q.pregunta} defaultOpen={i === 0}>
          <p>{q.respuesta}</p>
        </Disclosure>
      ))}
    </div>
  );
}
