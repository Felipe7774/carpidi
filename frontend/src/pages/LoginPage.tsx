import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthRequestError } from '../services/auth';
import { useAuth } from '../state/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      const from = typeof location.state?.from === 'string' ? location.state.from : '/';
      navigate(from, { replace: true });
    } catch (cause) {
      const status = cause instanceof AuthRequestError ? cause.status : undefined;
      const detail = cause instanceof AuthRequestError ? cause.message : undefined;
      setError(
        status === 401
          ? 'Correo o contraseña incorrectos. Verifica tus credenciales.'
          : detail ?? 'No fue posible iniciar sesión. Verifica tu conexión con el servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card narrow">
      <h1 className="serif-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Ingresar</h1>
      <p className="subtitle" style={{ textAlign: 'center' }}>
        Accede a tu cuenta de CARPIDI para continuar con tu compra y gestionar tu estilo.
      </p>

      {error && (
        <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form className="form-stitch" onSubmit={onSubmit}>
        <label>
          Correo
          <input
            type="email"
            placeholder="tu-correo@ejemplo.com"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <button className="button-stitch" type="submit" disabled={loading} style={{ marginTop: '0.75rem' }}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#57534E' }}>
        ¿Primera vez en CARPIDI?{' '}
        <Link to="/registro" style={{ color: '#1C1917', fontWeight: 700 }}>
          Crear cuenta
        </Link>
      </div>
    </section>
  );
}
