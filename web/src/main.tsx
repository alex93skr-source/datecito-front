import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { HeadProvider } from './seo';
import './styles.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <HeadProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
);

// Las páginas llegan prerenderizadas (HTML completo para buscadores y redes); aquí sólo se "hidratan".
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
