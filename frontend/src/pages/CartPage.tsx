import { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrder } from '../services/orders';
import { useAuth } from '../state/AuthContext';
import { useCart } from '../state/CartContext';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function CartPage() {
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Bogotá');
  const [country, setCountry] = useState('Colombia');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const order = await createOrder({
        items: items.map(item => ({ variantId: item.variantId, quantity: item.quantity })),
        paymentMethod: 'MANUAL_TEST',
        shippingAddress: { line1, city, country },
      });
      clear();
      setSuccess(`Pedido ${order.id} creado por ${money.format(order.total)}.`);
    } catch (cause) {
      const status = cause instanceof AxiosError ? cause.response?.status : undefined;
      setError(status === 401 || status === 403
        ? 'Debes iniciar sesión como cliente para comprar.'
        : 'No fue posible crear el pedido. Revisa stock y datos de envío.');
    } finally {
      setLoading(false);
    }
  };

  return <section>
    <h1>Tu carrito</h1>
    {success && <p className="success" role="status">{success}</p>}
    {items.length === 0 && !success && <p className="empty">Aún no tienes productos. <Link to="/catalogo">Explorar catálogo</Link></p>}
    {items.length > 0 && <div className="checkout-layout">
      <div className="cart-items">
        {items.map(item => <article key={item.variantId} className="cart-item">
          <div>
            <h2>{item.productName}</h2>
            <p>{item.size ?? 'Única'} · {item.color ?? 'Sin color'} · {money.format(item.price)}</p>
          </div>
          <label>Cantidad
            <input type="number" min="1" value={item.quantity}
              onChange={event => updateQuantity(item.variantId, Number(event.target.value))} />
          </label>
          <button type="button" className="secondary" onClick={() => removeItem(item.variantId)}>Quitar</button>
        </article>)}
      </div>
      <form className="form checkout" onSubmit={onSubmit}>
        <h2>Checkout</h2>
        <p className="price">Total: {money.format(total)}</p>
        {!user && <p className="error">Para finalizar compra primero debes <Link to="/login">iniciar sesión</Link>.</p>}
        <label>Dirección<input value={line1} onChange={event => setLine1(event.target.value)} required /></label>
        <label>Ciudad<input value={city} onChange={event => setCity(event.target.value)} required /></label>
        <label>País<input value={country} onChange={event => setCountry(event.target.value)} required /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button disabled={!user || loading}>{loading ? 'Creando pedido…' : 'Confirmar pedido'}</button>
      </form>
    </div>}
  </section>;
}
