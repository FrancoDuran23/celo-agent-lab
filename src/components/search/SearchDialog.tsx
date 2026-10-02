import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import clsx from "clsx";
import { TRAMITES } from "../../data/tramites";
import { IMPUESTOS } from "../../data/impuestos";
import { searchTramites } from "../../lib/search";
import { Icon } from "../../lib/icons";
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

  const go = (href: string) => {
    onClose();
    if (isExternal(href)) window.open(href, "_blank", "noopener,noreferrer");
    else navigate(href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) go(r.href);
      else if (q.trim()) go(`/tramites?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const impuestoNombre = (slug: string) => IMPUESTOS.find((i) => i.slug === slug)?.corto ?? "General";

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="Buscar trámites"
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-night-950/55 backdrop:backdrop-blur-sm sm:mx-auto sm:mt-[12vh] sm:h-auto sm:max-w-2xl sm:px-4"
    >
      <div className="flex h-full flex-col overflow-hidden bg-surface text-ink shadow-lift ring-1 ring-line sm:h-auto sm:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
          <Search className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            aria-autocomplete="list"
            aria-label="Buscar trámite"
            placeholder="Buscá un trámite: libre deuda, plan de pagos, sellos…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            className="h-16 min-w-0 flex-1 bg-transparent text-lg placeholder:text-ink-3 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
            aria-label="Cerrar buscador"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:max-h-[min(60vh,32rem)]">
          {results.length ? (
            <>
              <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-ink-3 uppercase">
                {q.trim() ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : "Trámites frecuentes"}
              </p>
              <ul id={listId} role="listbox" aria-label="Resultados">
                {results.map((t, i) => (
                  <li
                    key={t.id}
                    id={`${listId}-${t.id}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(t.href)}
                    className={clsx(
                      "flex cursor-pointer items-center gap-3.5 rounded-2xl px-3 py-3",
                      i === active ? "bg-surface-2" : "",
                    )}
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2 ring-1 ring-line">
                      <Icon name={t.icon} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{t.titulo}</span>
                      <span className="block truncate text-sm text-ink-3">
                        {impuestoNombre(t.impuesto)} · {t.descripcion}
                      </span>
                    </span>
                    {i === active ? (
                      <CornerDownLeft className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="font-medium">No encontramos “{q}”.</p>
              <p className="mt-1 text-sm text-ink-3">Probá con otras palabras o consultá a nuestros canales de atención.</p>
              <button
                type="button"
                onClick={() => go("/atencion")}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                Ir a Atención <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="hidden items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-3 sm:flex">
          <span className="flex items-center gap-3">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> para moverte <Kbd>Enter</Kbd> para abrir
          </span>
          <span>
            <Kbd>Esc</Kbd> para cerrar
          </span>
        </div>
      </div>
    </dialog>
  );
}

function Kbd({ children }: { children: string }) {
  return <kbd className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.7rem] ring-1 ring-line">{children}</kbd>;
}
