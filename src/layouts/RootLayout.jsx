import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function RootLayout() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">© {new Date().getFullYear()} Voluntariado • IFRS</div>
      </footer>
    </>
  );
}
