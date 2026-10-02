import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Search } from "lucide-react";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { Button } from "../components/ui/Button";
import { LinkList } from "../components/ui/primitives";

const DESTINOS = [
  { href: "/", title: "Inicio", description: "Volvé a la portada del sitio." },
  { href: "/tramites", title: "Trámites", description: "Buscá y filtrá todos los trámites." },
  { href: "/vencimientos", title: "Vencimientos", description: "Consultá el calendario de vencimientos." },
  { href: "/atencion", title: "Atención", description: "Canales, oficinas y turnos." },
];

export function NotFoundPage() {
  useDocumentTitle("Página no encontrada");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/tramites?q=${encodeURIComponent(term)}` : "/tramites");
  };

  return (
    <div className="container-page py-12 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-ink sm:text-[2.5rem]">No encontramos esta página</h1>
        <p className="mt-4 text-lg text-ink-2">
          No hay ninguna página en <span className="font-semibold text-ink [overflow-wrap:anywhere]">{pathname}</span>:
          puede que el enlace esté desactualizado o que la dirección tenga un error de tipeo.
        </p>

        <form role="search" aria-label="Buscar trámites" onSubmit={submit} className="mt-8">
          <label htmlFor="nf-buscar" className="mb-2 block font-semibold text-ink">
            Buscar un trámite
          </label>
          <div className="flex gap-2">
            <input
              id="nf-buscar"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Por ejemplo: libre deuda"
              autoComplete="off"
              enterKeyHint="search"
              className="h-12 min-w-0 flex-1 rounded-lg border border-ink-3 bg-surface px-4 text-base text-ink placeholder:text-ink-3"
            />
            <Button type="submit" size="lg" className="px-5">
              <Search aria-hidden="true" />
              <span className="max-sm:sr-only">Buscar</span>
            </Button>
          </div>
        </form>

        <section aria-labelledby="nf-destinos" className="mt-12">
          <h2 id="nf-destinos" className="text-xl font-bold text-ink">
            Otras páginas que te pueden servir
          </h2>
          <LinkList className="mt-4" columns={2} items={DESTINOS.map((d) => ({ ...d, key: d.href }))} />
        </section>
      </div>
    </div>
  );
}
