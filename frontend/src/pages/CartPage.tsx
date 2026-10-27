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
  const [createdOrderId, setCreatedOrderId] = useState('');
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
      setCreatedOrderId(order.id);
      setSuccess(`¡Compra exitosa! Pedido ${order.id.slice(0, 8)} confirmado por ${money.format(order.total)}.`);
    } catch (cause) {
      const status = cause instanceof AxiosError ? cause.response?.status : undefined;
      setError(
        status === 401 || status === 403
          ? 'Debes iniciar sesión como cliente para finalizar la compra.'
          : 'No fue posible crear el pedido. Verifica la disponibilidad del inventario y tus datos de envío.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">Bolsa de Compras</p>
        <h1 className="serif-title" style={{ fontSize: '2.5rem', margin: 0 }}>Tu carrito</h1>
      </div>

      {success && (
        <div className="card" style={{ textAlign: 'center', borderColor: '#10B981', backgroundColor: '#ECFDF5' }}>
          <h2 className="serif-title" style={{ color: '#065F46', marginBottom: '0.75rem' }}>¡Pedido Confirmado!</h2>
          <p style={{ color: '#047857', fontSize: '1.05rem', margin: '0 0 1.5rem' }}>{success}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/pedidos" className="button-stitch">Ver Mis Pedidos</Link>
            <Link to="/catalogo" className="secondary-stitch">Seguir Explorando</Link>
          </div>
        </div>
      )}

      {items.length === 0 && !success && (
        <div className="empty-state">
          <h3>Tu bolsa está vacía</h3>
          <p>No has añadido piezas a tu carrito aún. Explora nuestras colecciones en lino, seda y sastrería.</p>
          <Link to="/catalogo" className="button-stitch" style={{ marginTop: '1rem' }}>
            Explorar catálogo
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="checkout-grid">
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 className="serif-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #ECE6DE', paddingBottom: '0.75rem' }}>
              Prendas seleccionadas ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            <div>
              {items.map(item => (
                <article key={item.variantId} className="cart-item-card">
                  <div className="cart-item-info">
                    <h3>{item.productName}</h3>
                    <p>{item.size ?? 'Única'} · {item.color ?? 'Sin color'} · {money.format(item.price)} c/u</p>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#57534E' }}>
                      Cantidad
                      <input
                        type="number"
                        min="1"
                        max={item.available}
                        value={item.quantity}
                        onChange={e => updateQuantity(item.variantId, Number(e.target.value))}
                        style={{ width: '100%', padding: '0.45rem', marginTop: '0.2rem', border: '1px solid #D8CFC4', borderRadius: '4px' }}
                      />
                    </label>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="link-button"
                      style={{ color: '#991B1B', fontSize: '0.75rem', fontWeight: 600 }}
                      onClick={() => removeItem(item.variantId)}
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <form className="card" onSubmit={onSubmit} style={{ padding: '1.75rem' }}>
            <h2 className="serif-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Checkout</h2>
            <div style={{ padding: '1rem 0', borderBottom: '1px solid #ECE6DE', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total a pagar</span>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C1917', margin: '0.2rem 0 0' }}>{money.format(total)}</p>
            </div>

            {!user && (
              <div className="alert-error" role="alert" style={{ marginBottom: '1.25rem' }}>
                Para finalizar tu compra debes{' '}
                <Link to="/login" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'underline' }}>
                  iniciar sesión
                </Link>.
              </div>
            )}

            <div className="form-stitch">
              <label>
                Dirección
                <input
                  placeholder="Calle o Carrera # con número de apto"
                  value={line1}
                  onChange={e => setLine1(e.target.value)}
                  required
                />
              </label>

              <label>
                Ciudad
                <input
                  placeholder="Ej. Bogotá, Medellín, Cali"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                />
              </label>

              <label>
                País
                <input
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  required
                />
              </label>

              {error && <div className="alert-error" role="alert">{error}</div>}

              <button
                className="button-stitch"
                type="submit"
                disabled={!user || loading || items.length === 0}
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                {loading ? 'Creando pedido…' : 'Confirmar pedido'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
