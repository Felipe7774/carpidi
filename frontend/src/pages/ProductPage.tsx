import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, Product } from '../services/catalog';
import { useCart } from '../state/CartContext';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product>();
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(fetchedProduct => {
        setProduct(fetchedProduct);
        const firstAvailable = fetchedProduct.variants.find(v => v.available > 0) ?? fetchedProduct.variants[0];
        if (firstAvailable) {
          setSelectedVariantId(firstAvailable.id);
        }
      })
      .catch((cause: unknown) => {
        const status = cause instanceof AxiosError ? cause.response?.status : undefined;
        setError(status === 404 ? 'Esta prenda ya no está disponible en el catálogo.' : 'No fue posible cargar el detalle del producto.');
      });
  }, [id]);

  const selectedVariant = product?.variants.find(variant => variant.id === selectedVariantId) ?? product?.variants[0];

  if (error) {
    return (
      <div className="card narrow" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem' }}>Prenda no disponible</h1>
        <p className="alert-error" role="alert" style={{ margin: '1.5rem 0' }}>{error}</p>
        <Link to="/catalogo" className="button-stitch">Volver al catálogo</Link>
      </div>
    );
  }

  if (!product) {
    return <div className="loading-state" role="status">Cargando prenda exclusiva…</div>;
  }

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.available < 1) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedVariant);
    }
    setMessage(`¡Listo! Se agregaron ${quantity} unidad(es) de ${product.name} (${selectedVariant.size ?? 'Única'}) a tu bolsa.`);
  };

  return (
    <section>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.78rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Inicio</Link> /{' '}
        <Link to="/catalogo" style={{ color: 'inherit', textDecoration: 'none' }}>Catálogo</Link> /{' '}
        <span style={{ color: '#1C1917', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="product-detail-layout card">
        <div>
          <div className="detail-arched-frame" aria-hidden="true">
            <span>CARPIDI ATELIER</span>
          </div>
        </div>

        <div className="detail-content">
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="serif-title">{product.name}</h1>
          <p className="detail-price">{money.format(selectedVariant?.price ?? product.basePrice)}</p>

          <p className="detail-description">
            {product.description ?? 'Prenda confeccionada con tejidos nobles y siluetas contemporáneas concebida para perdurar en tu fondo de armario.'}
          </p>

          <div className="variant-selector-group">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#44403C' }}>
              Variantes disponibles ({product.variants.length})
            </span>
            <div className="variant-options-list">
              {product.variants.map(variant => (
                <label
                  key={variant.id}
                  className={`variant-pill-option ${selectedVariantId === variant.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="product-variant"
                    value={variant.id}
                    checked={selectedVariantId === variant.id}
                    onChange={() => {
                      setSelectedVariantId(variant.id);
                      setQuantity(1);
                    }}
                  />
                  <div style={{ flex: 1, fontSize: '0.85rem' }}>
                    <strong>{variant.size ?? 'Talla Única'}</strong> · <span>{variant.color ?? 'Color Único'}</span>
                    {variant.price !== product.basePrice && (
                      <span style={{ marginLeft: '0.5rem', color: '#8B395A', fontWeight: 600 }}>
                        ({money.format(variant.price)})
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: variant.available > 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                    {variant.available > 0 ? `${variant.available} disponibles` : 'Agotado'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {selectedVariant && selectedVariant.available > 0 && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Cantidad
                <input
                  type="number"
                  min="1"
                  max={selectedVariant.available}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(selectedVariant.available, Number(e.target.value))))}
                  style={{ width: '70px', padding: '0.6rem', marginLeft: '0.5rem', border: '1px solid #D8CFC4', borderRadius: '4px' }}
                />
              </label>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              className="button-stitch"
              type="button"
              disabled={!selectedVariant || selectedVariant.available < 1}
              onClick={handleAddToCart}
            >
              {!selectedVariant || selectedVariant.available < 1 ? 'Agotado' : 'Agregar a la bolsa'}
            </button>

            {message && (
              <div className="alert-success" role="status">
                {message} <Link to="/carrito" style={{ fontWeight: 700, marginLeft: '0.5rem', color: 'inherit' }}>Ver bolsa</Link>
              </div>
            )}
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #ECE6DE', display: 'grid', gap: '0.75rem', fontSize: '0.8rem', color: '#57534E' }}>
            <div>✓ Envíos de cortesía en compras superiores a $350.000 COP.</div>
            <div>✓ Garantía de satisfacción: 30 días para cambios de talla sin costo.</div>
            <div>✓ Empaque ecológico rígido con fragancia de autor.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
