import { FormEvent, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { StylePage } from '../pages/StylePage';
import { AdminPage } from '../pages/AdminPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AuthProvider, useAuth } from '../state/AuthContext';
import { CartProvider, useCart } from '../state/CartContext';

function AppShell() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const onNewsletterSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <>
      <div className="announcement-bar">
        ENVÍOS DE CORTESÍA A TODA COLOMBIA EN ÓRDENES SUPERIORES A $350.000 COP · ASESORÍA PERSONALIZADA EN LÍNEA
      </div>

      <header className="stitch-header">
        <Link to="/" className="brand-logo">CARPIDI</Link>
        <nav className="main-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inicio</Link>
          <Link to="/catalogo" className={location.pathname === '/catalogo' ? 'active' : ''}>Catálogo</Link>
          <Link to="/estilo" className={location.pathname === '/estilo' ? 'active' : ''}>Tu Estilo</Link>
          {user && <Link to="/pedidos" className={location.pathname === '/pedidos' ? 'active' : ''}>Mis Pedidos</Link>}
          {user && <Link to="/perfil" className={location.pathname === '/perfil' ? 'active' : ''}>Perfil</Link>}
          {user?.roles.includes('ADMIN') && <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link>}
        </nav>
        <div className="user-actions">
          {user ? (
            <>
              <span className="form-helper" style={{ margin: 0, fontWeight: 600 }}>{user.name}</span>
              <button className="link-button" onClick={logout} type="button">Salir</button>
            </>
          ) : (
            <Link to="/login" className="action-link">Ingresar</Link>
          )}
          <Link to="/carrito" className="bag-pill">
            <span>Bolsa</span>
            <span>{totalItems}</span>
          </Link>
        </div>
      </header>

      {user && (
        <div className="session-bar">
          Hola, {user.name}. Tu sesión está activa.
        </div>
      )}

      <main className="stitch-main">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/productos/:id" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/estilo" element={<StylePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Routes>
      </main>

      <footer className="stitch-footer">
        <div className="footer-pillars">
          <div className="footer-pillar-card">
            <strong>Envíos a toda Colombia</strong>
            <p>Entregas aseguradas y empaque en cajas rígidas ecológicas con fragancia de autor.</p>
          </div>
          <div className="footer-pillar-card">
            <strong>Cambios y devoluciones sin costo</strong>
            <p>30 días para solicitar cambio de talla o reembolso total con recolección en tu domicilio.</p>
          </div>
          <div className="footer-pillar-card">
            <strong>Asesoría de estilo boutique</strong>
            <p>Consultoría personalizada 1:1 por estilistas certificados para acompañar tu elección.</p>
          </div>
        </div>

        <div className="newsletter-section">
          <p className="eyebrow" style={{ textAlign: 'center' }}>La Gaceta CARPIDI</p>
          <h4>Historias de atelier y lanzamientos privados</h4>
          <p>Únete a nuestro círculo selecto para recibir invitaciones anticipadas a colecciones cápsula y artículos sobre sastrería y cuidado de fibras nobles.</p>
          {newsletterSubscribed ? (
            <p className="alert-success" role="status">¡Gracias por suscribirte a La Gaceta CARPIDI!</p>
          ) : (
            <form className="newsletter-form" onSubmit={onNewsletterSubmit}>
              <input
                type="email"
                placeholder="Introduce tu correo electrónico..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
              />
              <button className="button-stitch" type="submit">Suscribirme</button>
            </form>
          )}
        </div>

        <div className="footer-bottom">
          <div>
            <strong>CARPIDI</strong> — Maison de moda contemporánea inspirada en el quiet luxury y la durabilidad de las fibras puras.
          </div>
          <div className="footer-links">
            <Link to="/catalogo">Atención al cliente</Link>
            <Link to="/catalogo">Envíos y devoluciones</Link>
            <Link to="/catalogo">Guía de tallas</Link>
            <Link to="/catalogo">Términos y condiciones</Link>
            <Link to="/catalogo">Privacidad</Link>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: '#A8A29E' }}>
          © 2026 CARPIDI. Editorial Luxury Fashion. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  );
}
