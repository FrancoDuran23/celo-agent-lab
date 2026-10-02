import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CornerDownLeft,
  Search,
  X,
} from "lucide-react";
import clsx from "clsx";
import { TRAMITES } from "../../data/tramites";
import { IMPUESTOS } from "../../data/impuestos";
import { searchTramites } from "../../lib/search";
import { isExternal } from "../ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Buscador global de trámites (patrón combobox dentro de un <dialog> modal).
 * Flechas para moverse, Enter para abrir, Esc para cerrar.
 */
export function SearchDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchTramites(TRAMITES, q, 8), [q]);
  const query = q.trim();
  const optionId = (id: string) => `${listId}-${id}`;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  // Con el teclado, la opción activa siempre queda a la vista dentro de la lista.
  useEffect(() => {
    const r = results[active];
    if (open && r)
      document
        .getElementById(`${listId}-${r.id}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, results, open, listId]);

  const go = (href: string) => {
    onClose();
    if (isExternal(href)) window.open(href, "_blank", "noopener,noreferrer");
    else navigate(href);
  };

  const verTodos = () =>
    go(query ? `/tramites?q=${encodeURIComponent(query)}` : "/tramites");

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Escape") {
      // Esc cierra siempre, aunque el campo tenga texto (el navegador sólo lo borraría).
      e.preventDefault();
      onClose();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) go(r.href);
      else if (query) go(`/tramites?q=${encodeURIComponent(query)}`);
    }
  };

  const impuestoNombre = (slug: string) =>
    IMPUESTOS.find((i) => i.slug === slug)?.corto ?? "General";

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="Buscar trámites"
      className="m-0 mx-auto h-fit max-h-dvh w-full max-w-none overflow-visible bg-transparent p-2 backdrop:bg-ink/50 sm:mt-[10vh] sm:max-w-2xl sm:px-4 sm:py-0 dark:backdrop:bg-black/70"
    >
      {open ? (
        <div className="animate-pop flex max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-xl bg-surface text-ink shadow-pop sm:max-h-[min(80vh,40rem)] dark:ring-1 dark:ring-line">
          <div className="flex items-center gap-2 border-b border-line p-3 sm:gap-3 sm:p-4">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-3"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls={listId}
                aria-activedescendant={
                  results[active] ? optionId(results[active].id) : undefined
                }
                aria-autocomplete="list"
                aria-label="Buscar trámite"
                placeholder="Buscá un trámite"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                className="h-12 w-full min-w-0 rounded-lg border border-ink-3 bg-surface pr-3 pl-11 text-base text-ink placeholder:text-ink-3 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Cerrar buscador"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <p className="sr-only" aria-live="polite">
            {query
              ? results.length
                ? `${results.length} resultado${results.length === 1 ? "" : "s"}`
                : "Sin resultados"
              : ""}
          </p>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
            {results.length ? (
              <>
                <p
                  className="px-3 pt-2 pb-1.5 text-sm font-semibold text-ink-3"
                  aria-hidden="true"
                >
                  {query ? (
                    <>
                      <span className="tabular">{results.length}</span>{" "}
                      {results.length === 1 ? "resultado" : "resultados"}
                    </>
                  ) : (
                    "Trámites frecuentes"
                  )}
                </p>
                <ul id={listId} role="listbox" aria-label="Resultados">
                  {results.map((t, i) => {
                    const external = /^https?:/.test(t.href);
                    return (
                      <li
                        key={t.id}
                        id={optionId(t.id)}
                        role="option"
                        aria-selected={i === active}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(t.href)}
                        className={clsx(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-100",
                          i === active ? "bg-surface-2" : "",
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span
                            className={clsx(
                              "block font-semibold",
                              i === active ? "text-brand" : "text-ink",
                            )}
                          >
                            {t.titulo}
                            {external ? (
                              <span className="sr-only">
                                {" "}
                                (se abre en una pestaña nueva)
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-ink-3">
                            <span className="font-medium text-ink-2">
                              {impuestoNombre(t.impuesto)}
                            </span>{" "}
                            · {t.descripcion}
                          </span>
                        </span>
                        {i === active ? (
                          <CornerDownLeft
                            className="size-4 shrink-0 text-ink-3 max-sm:hidden"
                            aria-hidden="true"
                          />
                        ) : null}
                        {external ? (
                          <ArrowUpRight
                            className={clsx(
                              "size-4 shrink-0 text-ink-3",
                              i === active && "sm:hidden",
                            )}
                            aria-hidden="true"
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <div className="px-3 py-8 sm:px-4 sm:py-10">
                <p className="font-semibold text-ink [overflow-wrap:anywhere]">
                  No encontramos trámites para “{query}”.
                </p>
                <p className="mt-1 text-ink-3">
                  Probá con otras palabras o consultá a nuestros canales de
                  atención.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
                  <button
                    type="button"
                    onClick={verTodos}
                    className="link font-semibold"
                  >
                    Buscar en todos los trámites
                  </button>
                  <button
                    type="button"
                    onClick={() => go("/atencion")}
                    className="link font-semibold"
                  >
                    Ir a Atención
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className={clsx(
              "flex items-center justify-between gap-4 border-t border-line bg-surface-2 px-4 py-2.5 text-sm text-ink-3 sm:px-5",
              !results.length && "max-sm:hidden",
            )}
          >
            <p className="hidden items-center gap-4 sm:flex" aria-hidden="true">
              <span className="inline-flex items-center gap-1.5">
                <Kbd>
                  <ArrowUp />
                </Kbd>
                <Kbd>
                  <ArrowDown />
                </Kbd>
                para moverte
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Kbd>Enter</Kbd> para abrir
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Kbd>Esc</Kbd> para cerrar
              </span>
            </p>
            {results.length ? (
              <button
                type="button"
                onClick={verTodos}
                className="link ml-auto font-semibold"
              >
                {query ? "Ver todos los resultados" : "Ver todos los trámites"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line-strong bg-surface px-1.5 font-sans text-xs font-medium text-ink-2 [&_svg]:size-3.5">
      {children}
    </kbd>
  );
}
