import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";

/*
 * La portada va en el bundle inicial; el resto de las páginas se cargan
 * bajo demanda (un chunk por ruta).
 */
const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      // Mientras carga el chunk de la primera ruta (entrada directa a una página interna).
      hydrateFallbackElement: (
        <div className="min-h-dvh bg-bg" aria-busy="true" />
      ),
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "tramites",
          lazy: async () => ({
            Component: (await import("./pages/TramitesPage")).TramitesPage,
          }),
        },
        {
          path: "impuestos",
          lazy: async () => ({
            Component: (await import("./pages/ImpuestosPage")).ImpuestosPage,
          }),
        },
        {
          path: "impuestos/:slug",
          lazy: async () => ({
            Component: (await import("./pages/ImpuestoPage")).ImpuestoPage,
          }),
        },
        {
          path: "vencimientos",
          lazy: async () => ({
            Component: (await import("./pages/VencimientosPage"))
              .VencimientosPage,
          }),
        },
        {
          path: "atencion",
          lazy: async () => ({
            Component: (await import("./pages/AtencionPage")).AtencionPage,
          }),
        },
        {
          path: "normativa",
          lazy: async () => ({
            Component: (await import("./pages/NormativaPage")).NormativaPage,
          }),
        },
        {
          path: "noticias",
          lazy: async () => ({
            Component: (await import("./pages/NoticiasPage")).NoticiasPage,
          }),
        },
        {
          path: "ayuda",
          lazy: async () => ({
            Component: (await import("./pages/AyudaPage")).AyudaPage,
          }),
        },
        {
          path: "*",
          lazy: async () => ({
            Component: (await import("./pages/NotFoundPage")).NotFoundPage,
          }),
        },
      ],
    },
  ],
  // Permite servir el sitio bajo un subdirectorio (p. ej. GitHub Pages).
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);

export function App() {
  return <RouterProvider router={router} />;
}
