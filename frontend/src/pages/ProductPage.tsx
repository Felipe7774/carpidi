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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getProduct(id).then(setProduct).catch((cause: unknown) => {
      const status = cause instanceof AxiosError ? cause.response?.status : undefined;
      setError(status === 404 ? 'Este producto ya no está disponible.' : 'No fue posible cargar el producto.');
    });
  }, [id]);

  const selectedVariant = product?.variants.find(variant => variant.id === selectedVariantId) ?? product?.variants[0];

  if (error) return <section><p className="error" role="alert">{error}</p><Link to="/catalogo">Volver al catálogo</Link></section>;
  if (!product) return <section><p role="status">Cargando producto…</p></section>;
  return <section>
    <p className="eyebrow">{product.category.name}</p>
    <h1>{product.name}</h1>
    <p>{product.description ?? 'Prenda seleccionada para tu estilo.'}</p>
    <p className="price">{money.format(product.basePrice)}</p>
    <h2>Variantes disponibles</h2>
    <div className="variant-list">
      {product.variants.map(variant => <label key={variant.id} className="variant-option">
        <input type="radio" name="variant" checked={(selectedVariantId || product.variants[0]?.id) === variant.id}
          onChange={() => setSelectedVariantId(variant.id)} />
        <span>{variant.size ?? 'Única'} · {variant.color ?? 'Sin color'} · {variant.available} disponibles</span>
      </label>)}
    </div>
    <button disabled={!selectedVariant || selectedVariant.available < 1} onClick={() => {
      if (!selectedVariant) return;
      addItem(product, selectedVariant);
      setMessage('Producto agregado al carrito.');
    }}>Agregar al carrito</button>
    {message && <p className="success" role="status">{message} <Link to="/carrito">Ver carrito</Link></p>}
  </section>;
}
