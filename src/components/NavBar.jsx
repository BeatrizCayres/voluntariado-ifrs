import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/**
 * Barra de navegação. Os links mudam conforme o usuário está logado e o seu papel
 * @returns {JSX.Element}
 */
export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <nav className="navbar-inner">

        <div className="brand">Voluntariado IFRS</div>
        <ul className="nav-links">
          <li>
            <NavLink to="/about">Sobre</NavLink>
          </li>
          <li>
            <NavLink to="/events">Eventos</NavLink>
          </li>
          {!user && (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
          {user && (
            <>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/volunteers">Voluntários</NavLink>
              </li>
              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin">Admin</NavLink>
                </li>
              )}
              <li>
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
