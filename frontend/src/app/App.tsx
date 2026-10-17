import { Link, Route, Routes } from 'react-router-dom';
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
  return <>
    <header className="site-header">
      <Link className="brand" to="/">CARPIDI</Link>
      <nav className="site-nav" aria-label="Navegación principal">
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/estilo">Tu estilo</Link>
        {user && <Link to="/pedidos">Mis pedidos</Link>}
        {user && <Link to="/perfil">Perfil</Link>}
        {user?.roles.includes('ADMIN') && <Link to="/admin">Admin</Link>}
      </nav>
      <div className="site-actions">{user ? <button className="link-button" onClick={logout}>Salir</button> : <Link to="/login">Ingresar</Link>}<Link className="cart-link" to="/carrito">Bolsa <span>{totalItems}</span></Link></div>
    </header>
    {user && <p className="session">Hola, {user.name}. Tu sesión está activa.</p>}
    <main>
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
  </>;
}

export function App() {
  return <AuthProvider><CartProvider><AppShell /></CartProvider></AuthProvider>;
}
