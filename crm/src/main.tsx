import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import Analytics from './pages/Analytics';
import Audit from './pages/Audit';
import Behavior from './pages/Behavior';
import Billing from './pages/Billing';
import Connections from './pages/Connections';
import Dashboard from './pages/Dashboard';
import Datecitos from './pages/Datecitos';
import Here from './pages/Here';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import SafeSessions from './pages/SafeSessions';
import Settings from './pages/Settings';
import Staff from './pages/Staff';
import UserDetail from './pages/UserDetail';
import Users from './pages/Users';
import Verifications from './pages/Verifications';
import { AuthProvider, useAuth } from './store/Auth';
import './styles.css';

function Guard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') return <div className="loading-bar" />;
  if (status === 'anonymous') return <Navigate to="/entrar" replace />;
  return <>{children}</>;
}

function Anonymous({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'ready') return <Navigate to="/" replace />;
  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/entrar"
            element={
              <Anonymous>
                <Login />
              </Anonymous>
            }
          />
          <Route
            element={
              <Guard>
                <Layout />
              </Guard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="analitica" element={<Analytics />} />
            <Route path="comportamiento" element={<Behavior />} />
            <Route path="monetizacion" element={<Billing />} />
            <Route path="usuarios" element={<Users />} />
            <Route path="usuarios/:id" element={<UserDetail />} />
            <Route path="conexiones" element={<Connections />} />
            <Route path="conexiones/:id" element={<Connections />} />
            <Route path="datecitos" element={<Datecitos />} />
            <Route path="aqui-y-ahora" element={<Here />} />
            <Route path="moderacion/reportes" element={<Reports />} />
            <Route path="moderacion/verificaciones" element={<Verifications />} />
            <Route path="seguridad" element={<SafeSessions />} />
            <Route path="auditoria" element={<Audit />} />
            <Route path="equipo" element={<Staff />} />
            <Route path="ajustes" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
