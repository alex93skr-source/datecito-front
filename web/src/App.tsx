import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppStateProvider } from './components/AppState';
import { Layout } from './components/Layout';
import { LangGate, RootRedirect } from './i18n';
import { Alianzas, Descargar, Marca, Nosotros, Prensa } from './pages/Company';
import { Contacto, FaqPage, HelpArticle, HelpCategory, HelpCenter } from './pages/Help';
import Home from './pages/Home';
import { Blog, BlogPost, Consejos, Destino, Destinos } from './pages/Learn';
import { Accesibilidad, Arco, EliminarCuenta, LegalDocRoute, LegalIndex, OpcionesPrivacidad, SeguridadInformatica } from './pages/Legal';
import NotFound from './pages/NotFound';
import { AquiYAhora, Datecitos, Funciones, Membresia, SuperLikes, Verificacion } from './pages/Product';
import { Autoridades, Menores, Normas, Politicas, Recursos, SafetyCenter, SafetyTips } from './pages/Safety';
import { Sitemap } from './pages/Sitemap';

/** Rutas antiguas que cambiaron de nombre: se redirigen conservando el idioma. */
function Moved({ to }: { to: string }) {
  const { pathname } = useLocation();
  const lang = pathname.split('/')[1] || 'es';
  return <Navigate to={`/${lang}${to}`} replace />;
}

/** Rutas del sitio (las usan el navegador y el prerender). Todas viven bajo /es o /en. */
export function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route index element={<RootRedirect />} />
        <Route path=":lang" element={<LangGate />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="funciones" element={<Funciones />} />
            <Route path="membresia" element={<Membresia />} />
            <Route path="super-likes" element={<SuperLikes />} />
            <Route path="super-likes-y-boost" element={<Moved to="/super-likes" />} />
            <Route path="datecitos" element={<Datecitos />} />
            <Route path="aqui-y-ahora" element={<AquiYAhora />} />
            <Route path="verificacion" element={<Verificacion />} />

            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="consejos" element={<Consejos />} />
            <Route path="destinos" element={<Destinos />} />
            <Route path="destinos/:slug" element={<Destino />} />

            <Route path="seguridad" element={<SafetyCenter />} />
            <Route path="seguridad/consejos" element={<SafetyTips />} />
            <Route path="seguridad/normas-de-la-comunidad" element={<Normas />} />
            <Route path="seguridad/politicas" element={<Politicas />} />
            <Route path="seguridad/recursos" element={<Recursos />} />
            <Route path="seguridad/autoridades" element={<Autoridades />} />
            <Route path="seguridad/menores" element={<Menores />} />
            <Route path="seguridad-informatica" element={<SeguridadInformatica />} />

            <Route path="ayuda" element={<HelpCenter />} />
            <Route path="ayuda/categoria/:slug" element={<HelpCategory />} />
            <Route path="ayuda/:slug" element={<HelpArticle />} />
            <Route path="preguntas-frecuentes" element={<FaqPage />} />
            <Route path="contacto" element={<Contacto />} />

            <Route path="descargar" element={<Descargar />} />
            <Route path="eliminar-cuenta" element={<EliminarCuenta />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="prensa" element={<Prensa />} />
            <Route path="alianzas" element={<Alianzas />} />
            <Route path="marca" element={<Marca />} />
            <Route path="accesibilidad" element={<Accesibilidad />} />

            <Route path="legal" element={<LegalIndex />} />
            <Route path="legal/opciones-de-privacidad" element={<OpcionesPrivacidad />} />
            <Route path="legal/arco" element={<Arco />} />
            <Route path="legal/:slug" element={<LegalDocRoute />} />

            <Route path="mapa-del-sitio" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </AppStateProvider>
  );
}

/** Rutas estáticas (sin prefijo de idioma) que se prerenderizan y van al sitemap. */
export const staticRoutes = [
  '/',
  '/funciones',
  '/membresia',
  '/super-likes',
  '/datecitos',
  '/aqui-y-ahora',
  '/verificacion',
  '/blog',
  '/consejos',
  '/destinos',
  '/seguridad',
  '/seguridad/consejos',
  '/seguridad/normas-de-la-comunidad',
  '/seguridad/politicas',
  '/seguridad/recursos',
  '/seguridad/autoridades',
  '/seguridad/menores',
  '/seguridad-informatica',
  '/ayuda',
  '/preguntas-frecuentes',
  '/contacto',
  '/descargar',
  '/eliminar-cuenta',
  '/nosotros',
  '/prensa',
  '/alianzas',
  '/marca',
  '/accesibilidad',
  '/legal',
  '/legal/opciones-de-privacidad',
  '/legal/arco',
  '/mapa-del-sitio',
];
