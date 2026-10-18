import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import RequireRole from './auth/RequireRole';
import RootLayout from './layouts/RootLayout';
import About from './pages/About';
import Login from './pages/Login';
import Forbidden from './pages/Forbidden';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Events from './pages/Events';
import EventForm from './pages/EventForm';
import Volunteers from './pages/Volunteers';

// Fallback para rotas inexistentes
function NotFound() {
  return (
    <main className="container">
      <h1>404 — Página não encontrada</h1>
      <p>Verifique a URL ou volte para a dashboard.</p>
    </main>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      // públicas
      { path: 'about', element: <About /> },
      { path: 'login', element: <Login /> },
      { path: 'forbidden', element: <Forbidden /> },
      { path: 'events', element: <Events /> },

      // protegida por autenticação (token)
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: 'volunteers',
        element: (
          <RequireAuth>
            <Volunteers />
          </RequireAuth>
        ),
      },

      // protegidas por autenticação + papel específico (admin)
      {
        path: 'events/new',
        element: (
          <RequireAuth>
            <RequireRole role="admin">
              <EventForm />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: 'events/:id/edit',
        element: (
          <RequireAuth>
            <RequireRole role="admin">
              <EventForm />
            </RequireRole>
          </RequireAuth>
        ),
      },
      {
        path: 'admin',
        element: (
          <RequireAuth>
            <RequireRole role="admin">
              <Admin />
            </RequireRole>
          </RequireAuth>
        ),
      },

      // fallback
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
