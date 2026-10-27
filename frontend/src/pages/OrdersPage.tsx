import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, Order } from '../services/orders';
import { useAuth } from '../state/AuthContext';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError('');
      getOrders()
        .then(setOrders)
        .catch(() => setError('No fue posible cargar tu historial de pedidos. Inténtalo más tarde.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <section className="card narrow" style={{ textAlign: 'center' }}>
        <h1 className="serif-title">Mis pedidos</h1>
        <p className="subtitle">Ingresa a tu cuenta para consultar el estado y detalle de tus compras.</p>
        <Link className="button-stitch" to="/login">Ingresar</Link>
      </section>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>PENDIENTE DE PAGO</span>;
      case 'PAID':
        return <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>PAGADO</span>;
      case 'SHIPPED':
      case 'DELIVERED':
        return <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>{status}</span>;
      default:
        return <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>{status}</span>;
    }
  };

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">Historial de Compras</p>
        <h1 className="serif-title" style={{ fontSize: '2.5rem', margin: 0 }}>Mis pedidos</h1>
        <p style={{ color: '#78716C', marginTop: '0.35rem' }}>Consulta el estado, fecha y detalle de tus piezas adquiridas en CARPIDI.</p>
      </div>

      {loading && <div className="loading-state" role="status">Cargando tus compras…</div>}
      {error && <div className="alert-error" role="alert" style={{ marginBottom: '2rem' }}>{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <h3>Aún no tienes pedidos registrados</h3>
          <p>Tus compras confirmadas aparecerán aquí con su respectivo número de orden e inventario.</p>
          <Link to="/catalogo" className="button-stitch" style={{ marginTop: '1rem' }}>
            Explorar catálogo
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {orders.map(order => (
            <article key={order.id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ECE6DE', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                    Pedido #{order.id.slice(0, 8).toUpperCase()}
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#78716C', marginTop: '0.2rem' }}>
                    {new Date(order.createdAt).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getStatusBadge(order.status)}
                  <strong style={{ fontSize: '1.25rem', color: '#1C1917' }}>{money.format(order.total)}</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#78716C' }}>
                  Artículos incluidos ({order.items.reduce((s, i) => s + i.quantity, 0)})
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'grid', gap: '0.5rem' }}>
                  {order.items.map(item => (
                    <li key={item.variantId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#44403C' }}>
                      <span>
                        <strong>{item.quantity}×</strong> {item.productName}
                        {(item.size || item.color) && (
                          <span style={{ color: '#78716C', marginLeft: '0.4rem', fontSize: '0.82rem' }}>
                            ({item.size ?? 'Única'} · {item.color ?? 'Único'})
                          </span>
                        )}
                      </span>
                      <span>{money.format(item.unitPrice * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
