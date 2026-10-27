import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthRequestError } from '../services/auth';
import { useAuth } from '../state/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      const from = typeof location.state?.from === 'string' ? location.state.from : '/';
      navigate(from, { replace: true });
    } catch (cause) {
      const status = cause instanceof AuthRequestError ? cause.status : undefined;
      const validationMessage = cause instanceof AuthRequestError ? cause.message : undefined;
      setError(
        status === 409
          ? 'Ese correo ya está registrado en CARPIDI. Por favor inicia sesión.'
          : validationMessage ?? 'No fue posible crear la cuenta. Revisa los requisitos de contraseña e inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card narrow">
      <h1 className="serif-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Crear cuenta</h1>
      <p className="subtitle" style={{ textAlign: 'center' }}>
        Regístrate para recibir recomendaciones según tu morfología y realizar pedidos seguros.
      </p>

      {error && (
        <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form className="form-stitch" onSubmit={onSubmit}>
        <label>
          Nombre
          <input
            placeholder="Tu nombre completo"
            value={name}
            onChange={event => setName(event.target.value)}
            required
            maxLength={150}
            autoComplete="name"
          />
        </label>

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
            placeholder="Mínimo 12 caracteres..."
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            minLength={12}
            autoComplete="new-password"
          />
          <span className="form-helper">
            Debe incluir al menos 12 caracteres, mayúscula, minúscula, número y símbolo.
          </span>
        </label>

        <button className="button-stitch" type="submit" disabled={loading} style={{ marginTop: '0.75rem' }}>
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#57534E' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: '#1C1917', fontWeight: 700 }}>
          Ingresar
        </Link>
      </div>
    </section>
  );
}
