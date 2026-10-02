// Stub provisorio — se reemplaza por el buscador completo.
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Buscar trámite" onClick={onClose} className="fixed inset-0 z-50 bg-black/40" />
  );
}
