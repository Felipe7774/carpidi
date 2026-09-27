import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createProduct, deactivateProduct, getCategories, getProducts, Category, Product } from '../services/catalog';
import { getOrders, Order } from '../services/orders';
import { useAuth } from '../state/AuthContext';

type DraftVariant = { sku: string; size: string; color: string; price: string; available: string };
const emptyVariant = (): DraftVariant => ({ sku: '', size: '', color: '', price: '', available: '' });

export function AdminPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('ADMIN');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [variants, setVariants] = useState<DraftVariant[]>([emptyVariant()]);

  const load = () => Promise.all([getProducts({}), getCategories(), getOrders()]).then(([p, c, o]) => {
    setProducts(p.content); setCategories(c); setCategoryId(current => current || c[0]?.id || ''); setOrders(o);
  });
  useEffect(() => { if (isAdmin) load().catch(() => setError('No se pudo cargar el dashboard. Verifica los permisos de administrador.')); }, [isAdmin]);
  if (!user) return <section className="card"><h1>Panel administrativo</h1><p>Debes iniciar sesión.</p><Link className="button" to="/login">Ingresar</Link></section>;
  if (!isAdmin) return <section className="card"><h1>Acceso restringido</h1><p>Esta sección solo está disponible para administradores.</p></section>;

  const updateVariant = (index: number, field: keyof DraftVariant, value: string) => {
    setVariants(current => current.map((variant, position) => position === index ? { ...variant, [field]: value } : variant));
  };
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setSuccess(''); setSubmitting(true);
    try {
      await createProduct({ categoryId, slug, name, description, basePrice: Number(price), active: true,
        variants: variants.map(variant => ({ sku: variant.sku, size: variant.size, color: variant.color, price: Number(variant.price || price), available: Number(variant.available) })) });
      setName(''); setSlug(''); setDescription(''); setPrice(''); setVariants([emptyVariant()]);
      setSuccess('Producto, variantes e inventario inicial creados correctamente.'); await load();
    } catch { setError('No se pudo crear el producto. Revisa que el slug y cada SKU sean únicos y que los precios e inventarios sean válidos.'); }
    finally { setSubmitting(false); }
  }
  async function remove(id: string) { if (!window.confirm('¿Desactivar este producto? Ya no aparecerá en el catálogo.')) return; try { await deactivateProduct(id); await load(); } catch { setError('No se pudo desactivar el producto.'); } }

  return <section>
    <div className="card"><h1>Panel administrativo</h1><p>Resumen operativo de CARPIDI.</p><div className="stats"><div><strong>{products.length}</strong><span>Productos activos</span></div><div><strong>{orders.length}</strong><span>Pedidos registrados</span></div><div><strong>${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('es-CO')}</strong><span>Ventas acumuladas</span></div></div>{error && <p className="error" role="alert">{error}</p>}{success && <p className="success" role="status">{success}</p>}</div>
    <div className="card"><h2>Crear producto e inventario</h2><p>Registra la información comercial y al menos una variante vendible.</p><form className="form" onSubmit={submit}>
      <label>Nombre<input required maxLength={160} placeholder="Gorra urbana negra" value={name} onChange={event => setName(event.target.value)} /></label>
      <label>Slug (URL amigable)<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="gorra-urbana-negra" value={slug} onChange={event => setSlug(event.target.value.toLowerCase())} /></label>
      <label>Descripción<textarea required maxLength={4000} placeholder="Describe el material, estilo y ocasión de uso." value={description} onChange={event => setDescription(event.target.value)} /></label>
      <label>Categoría<select required value={categoryId} onChange={event => setCategoryId(event.target.value)}><option value="">Selecciona una categoría</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label>Precio base (COP)<input required min="0.01" step="0.01" type="number" placeholder="59900" value={price} onChange={event => setPrice(event.target.value)} /></label>
      <fieldset className="variants-fieldset"><legend>Variantes e inventario</legend>{variants.map((variant, index) => <div className="variant-editor" key={index}><strong>Variante {index + 1}</strong><input required pattern="[A-Za-z0-9_-]+" maxLength={80} placeholder="SKU · GOR-NEG-UNI" value={variant.sku} onChange={event => updateVariant(index, 'sku', event.target.value.toUpperCase())} /><input maxLength={30} placeholder="Talla · Única" value={variant.size} onChange={event => updateVariant(index, 'size', event.target.value)} /><input maxLength={50} placeholder="Color · Negro" value={variant.color} onChange={event => updateVariant(index, 'color', event.target.value)} /><input min="0.01" step="0.01" type="number" placeholder="Precio variante (usa base si vacío)" value={variant.price} onChange={event => updateVariant(index, 'price', event.target.value)} /><input required min="0" step="1" type="number" placeholder="Cantidad disponible" value={variant.available} onChange={event => updateVariant(index, 'available', event.target.value)} />{variants.length > 1 && <button className="secondary" type="button" onClick={() => setVariants(current => current.filter((_, position) => position !== index))}>Quitar variante</button>}</div>)}<button className="secondary" type="button" onClick={() => setVariants(current => [...current, emptyVariant()])}>+ Agregar otra talla o color</button></fieldset>
      <button disabled={submitting}>{submitting ? 'Creando producto…' : 'Crear producto'}</button>
    </form></div>
    <div className="card"><h2>Productos publicados</h2><div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Inventario</th><th>Acción</th></tr></thead><tbody>{products.map(product => <tr key={product.id}><td>{product.name}</td><td>{product.category.name}</td><td>${product.basePrice.toLocaleString('es-CO')}</td><td>{product.variants.reduce((total, variant) => total + variant.available, 0)}</td><td><button className="secondary" onClick={() => remove(product.id)}>Desactivar</button></td></tr>)}</tbody></table></div></div>
  </section>;
}
