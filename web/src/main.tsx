import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppStateProvider } from './components/AppState';
import { Layout } from './components/Layout';
import { LangGate, RootRedirect } from './i18n';
import { Blog, BlogPost, Consejos, Destino, Destinos, Historias } from './pages/Learn';
import { Alianzas, CodigoPromo, Descargar, Empleos, Marca, Nosotros, Prensa, Tecnologia } from './pages/Company';
import { Contacto, FaqPage, HelpArticle, HelpCategory, HelpCenter } from './pages/Help';
import Home from './pages/Home';
import { Accesibilidad, Arco, LegalDocRoute, LegalIndex, OpcionesPrivacidad, SeguridadInformatica } from './pages/Legal';
import NotFound from './pages/NotFound';
import { AquiYAhora, Datecitos, Funciones, Membresia, SuperLikes, Universitarios, Verificacion } from './pages/Product';
import { Autoridades, Normas, Politicas, Recursos, SafetyCenter, SafetyTips, Transparencia } from './pages/Safety';
import { Sitemap } from './pages/Sitemap';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppStateProvider>
        <Routes>
          <Route index element={<RootRedirect />} />
          <Route path=":lang" element={<LangGate />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />

              <Route path="funciones" element={<Funciones />} />
              <Route path="membresia" element={<Membresia />} />
              <Route path="super-likes-y-boost" element={<SuperLikes />} />
              <Route path="datecitos" element={<Datecitos />} />
              <Route path="aqui-y-ahora" element={<AquiYAhora />} />
              <Route path="verificacion" element={<Verificacion />} />
              <Route path="universitarios" element={<Universitarios />} />

              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="consejos" element={<Consejos />} />
              <Route path="destinos" element={<Destinos />} />
              <Route path="destinos/:slug" element={<Destino />} />
              <Route path="historias" element={<Historias />} />

              <Route path="seguridad" element={<SafetyCenter />} />
              <Route path="seguridad/consejos" element={<SafetyTips />} />
              <Route path="seguridad/normas-de-la-comunidad" element={<Normas />} />
              <Route path="seguridad/politicas" element={<Politicas />} />
              <Route path="seguridad/recursos" element={<Recursos />} />
              <Route path="seguridad/autoridades" element={<Autoridades />} />
              <Route path="transparencia" element={<Transparencia />} />
              <Route path="seguridad-informatica" element={<SeguridadInformatica />} />

              <Route path="ayuda" element={<HelpCenter />} />
              <Route path="ayuda/categoria/:slug" element={<HelpCategory />} />
              <Route path="ayuda/:slug" element={<HelpArticle />} />
              <Route path="preguntas-frecuentes" element={<FaqPage />} />
              <Route path="contacto" element={<Contacto />} />

              <Route path="descargar" element={<Descargar />} />
              <Route path="codigo-promocional" element={<CodigoPromo />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="empleos" element={<Empleos />} />
              <Route path="tecnologia" element={<Tecnologia />} />
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
    </BrowserRouter>
  </StrictMode>,
);
