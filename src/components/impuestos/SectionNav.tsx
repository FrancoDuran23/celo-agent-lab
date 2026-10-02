import { useEffect, useState } from "react";
import clsx from "clsx";

export interface NavSection {
  id: string;
  label: string;
}

/** Sección visible según el scroll (la última cuyo título pasó la línea de lectura). */
function useScrollSpy(ids: string[], offset = 160) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const list = key.split("|").filter(Boolean);
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current = list[0] ?? "";
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // Al llegar al final, marcar la última sección aunque sea corta.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = list[list.length - 1] ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key, offset]);

  return active;
}

/**
 * Índice "En esta página": enlaces de texto con anclas nativas (funciona sin JS).
 * En escritorio queda fijo al costado y marca la sección que se está leyendo;
 * en móvil es una lista simple al principio del contenido.
 */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const active = useScrollSpy(sections.map((s) => s.id));

  return (
    <nav aria-labelledby="en-esta-pagina">
      <p id="en-esta-pagina" className="font-semibold text-ink">
        En esta página
      </p>
      <ul className="mt-3 grid gap-2.5 text-[0.95rem]">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                className={clsx(
                  "link",
                  isActive && "lg:font-semibold lg:text-ink lg:decoration-brand lg:decoration-2 lg:underline-offset-[0.3em]",
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
