import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { TramitesPage } from "./pages/TramitesPage";
import { ImpuestosPage } from "./pages/ImpuestosPage";
import { ImpuestoPage } from "./pages/ImpuestoPage";
import { VencimientosPage } from "./pages/VencimientosPage";
import { AtencionPage } from "./pages/AtencionPage";
import { NormativaPage } from "./pages/NormativaPage";
import { NoticiasPage } from "./pages/NoticiasPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tramites", element: <TramitesPage /> },
      { path: "impuestos", element: <ImpuestosPage /> },
      { path: "impuestos/:slug", element: <ImpuestoPage /> },
      { path: "vencimientos", element: <VencimientosPage /> },
      { path: "atencion", element: <AtencionPage /> },
      { path: "normativa", element: <NormativaPage /> },
      { path: "noticias", element: <NoticiasPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
