import { Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <section className="card narrow" style={{ textAlign: 'center' }}>
        <h1 className="serif-title">Mi perfil</h1>
        <p className="subtitle">Debes iniciar sesión para consultar los detalles de tu cuenta.</p>
        <Link className="button-stitch" to="/login">Ingresar</Link>
      </section>
    );
  }

  return (
    <section className="card narrow">
      <h1 className="serif-title" style={{ fontSize: '2.25rem', marginBottom: '1.5rem' }}>Mi perfil</h1>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem', fontSize: '0.95rem' }}>
        <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #ECE6DE' }}>
          <span style={{ fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Nombre</span>
          <strong style={{ fontSize: '1.1rem', color: '#1C1917' }}>{user.name}</strong>
        </div>

        <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #ECE6DE' }}>
          <span style={{ fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Correo</span>
          <strong style={{ fontSize: '1.1rem', color: '#1C1917' }}>{user.email}</strong>
        </div>

        <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #ECE6DE' }}>
          <span style={{ fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Roles asignados</span>
          <strong style={{ fontSize: '1rem', color: '#8B395A' }}>{user.roles.join(', ')}</strong>
        </div>
      </div>

      <div className="alert-success" style={{ marginBottom: '2rem', fontSize: '0.82rem' }}>
        Tu sesión está protegida con JWT. Las credenciales nunca se muestran.
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <Link to="/pedidos" className="secondary-stitch" style={{ textAlign: 'center' }}>
          Consultar Mis Pedidos
        </Link>
        <Link to="/estilo" className="secondary-stitch" style={{ textAlign: 'center' }}>
          Modificar Preferencias de Estilo
        </Link>
        {user.roles.includes('ADMIN') && (
          <Link to="/admin" className="secondary-stitch" style={{ textAlign: 'center', borderColor: '#8B395A', color: '#8B395A' }}>
            Acceder al Panel Administrativo
          </Link>
        )}
        <button
          type="button"
          className="button-stitch"
          onClick={logout}
          style={{ backgroundColor: '#44403C', marginTop: '0.5rem' }}
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
