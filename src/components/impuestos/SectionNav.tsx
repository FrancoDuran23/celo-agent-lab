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
 * Índice "En esta página": columna fija en escritorio, fila de chips
 * desplazable en móvil. Usa anclas nativas (funciona sin JS).
 */
export function SectionNav({ sections, accent }: { sections: NavSection[]; accent: string }) {
  const active = useScrollSpy(sections.map((s) => s.id));

  return (
    <nav aria-labelledby="en-esta-pagina">
      <p id="en-esta-pagina" className="eyebrow mb-3">
        En esta página
      </p>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:border-l lg:border-line lg:px-0 lg:pb-0">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="shrink-0 lg:-ml-px">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                className={clsx(
                  "relative flex items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  "lg:rounded-none lg:rounded-r-lg lg:border-l-2 lg:py-2 lg:pr-3 lg:pl-4",
                  isActive
                    ? "bg-night-900 text-crema-50 dark:bg-crema-100 dark:text-night-900 lg:bg-transparent lg:text-ink lg:dark:bg-transparent lg:dark:text-ink"
                    : "bg-surface text-ink-3 ring-1 ring-line hover:text-ink lg:border-transparent lg:bg-transparent lg:ring-0 lg:hover:bg-surface-2",
                )}
                style={isActive ? { borderLeftColor: accent } : undefined}
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
