import { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
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
      navigate('/carrito');
    } catch (cause) {
      const status = cause instanceof AxiosError ? cause.response?.status : undefined;
      setError(status === 401 ? 'Correo o contraseña incorrectos.' : 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return <section className="narrow">
    <h1>Ingresar</h1>
    <form className="form" onSubmit={onSubmit}>
      <label>Correo<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label>Contraseña<input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar'}</button>
    </form>
    <p>¿Primera vez en CARPIDI? <Link to="/registro">Crear cuenta</Link></p>
  </section>;
}
