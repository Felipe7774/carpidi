import { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
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
      navigate('/carrito');
    } catch (cause) {
      const status = cause instanceof AxiosError ? cause.response?.status : undefined;
      setError(status === 409 ? 'Ese correo ya está registrado.' : 'La contraseña debe tener mínimo 12 caracteres, mayúscula, minúscula, número y símbolo.');
    } finally {
      setLoading(false);
    }
  };

  return <section className="narrow">
    <h1>Crear cuenta</h1>
    <form className="form" onSubmit={onSubmit}>
      <label>Nombre<input value={name} onChange={event => setName(event.target.value)} required maxLength={150} /></label>
      <label>Correo<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label>Contraseña<input type="password" value={password} onChange={event => setPassword(event.target.value)} required minLength={12} /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button disabled={loading}>{loading ? 'Creando…' : 'Crear cuenta'}</button>
    </form>
    <p>¿Ya tienes cuenta? <Link to="/login">Ingresar</Link></p>
  </section>;
}
