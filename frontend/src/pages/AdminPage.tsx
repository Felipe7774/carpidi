import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createCategory,
  createProduct,
  deactivateProduct,
  getCategories,
  getProducts,
  updateProduct,
  Category,
  Product,
} from '../services/catalog';
import { getOrders, Order } from '../services/orders';
import { useAuth } from '../state/AuthContext';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

type DraftVariant = { sku: string; size: string; color: string; price: string; available: string };
const emptyVariant = (): DraftVariant => ({ sku: '', size: '', color: '', price: '', available: '10' });

export function AdminPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('ADMIN');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Campos de formulario de creación de producto
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [variants, setVariants] = useState<DraftVariant[]>([emptyVariant()]);

  // Formulario de categoría
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Edición de producto
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadData = () => {
    setLoading(true);
    return Promise.all([getProducts({}), getCategories(), getOrders()])
      .then(([p, c, o]) => {
        setProducts(p.content);
        setCategories(c);
        setCategoryId(current => current || c[0]?.id || '');
        setOrders(o);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin) {
      loadData().catch(() => setError('No fue posible cargar la información operativa. Verifica los permisos de administrador.'));
    }
  }, [isAdmin]);

  if (!user) {
    return (
      <section className="card narrow" style={{ textAlign: 'center' }}>
        <h1 className="serif-title">Panel administrativo</h1>
        <p className="subtitle">Debes iniciar sesión con una cuenta de administrador para acceder.</p>
        <Link className="button-stitch" to="/login">Ingresar</Link>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="card narrow" style={{ textAlign: 'center' }}>
        <h1 className="serif-title" style={{ color: '#991B1B' }}>Acceso restringido</h1>
        <p className="subtitle">Esta sección solo está disponible para usuarios con rol ADMINISTRADOR.</p>
        <Link className="button-stitch" to="/">Volver al inicio</Link>
      </section>
    );
  }

  const updateVariant = (index: number, field: keyof DraftVariant, value: string) => {
    setVariants(current =>
      current.map((variant, position) => (position === index ? { ...variant, [field]: value } : variant))
    );
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await createProduct({
        categoryId,
        slug,
        name,
        description,
        imageUrl: imageUrl.trim() || undefined,
        basePrice: Number(price),
        active: true,
        variants: variants.map(variant => ({
          sku: variant.sku.trim().toUpperCase(),
          size: variant.size.trim(),
          color: variant.color.trim(),
          price: Number(variant.price || price),
          available: Number(variant.available),
        })),
      });

      setName('');
      setSlug('');
      setDescription('');
      setImageUrl('');
      setPrice('');
      setVariants([emptyVariant()]);
      setSuccess('Prenda, variantes e inventario inicial registrados correctamente en CARPIDI.');
      await loadData();
    } catch {
      setError('No se pudo crear el producto. Verifica que el slug y cada SKU sean únicos y que los campos numéricos sean válidos.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !newCategorySlug.trim()) return;
    setCreatingCategory(true);
    setError('');
    setSuccess('');
    try {
      const created = await createCategory({
        name: newCategoryName.trim(),
        slug: newCategorySlug.trim().toLowerCase(),
      });
      setCategories(curr => [...curr, created]);
      setCategoryId(created.id);
      setNewCategoryName('');
      setNewCategorySlug('');
      setShowCategoryForm(false);
      setSuccess(`Categoría "${created.name}" creada exitosamente.`);
    } catch {
      setError('No fue posible crear la categoría. Verifica que el slug sea único y use solo caracteres permitidos.');
    } finally {
      setCreatingCategory(false);
    }
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSlug(prod.slug);
    setEditDescription(prod.description ?? '');
    setEditImageUrl(prod.imageUrl ?? '');
    setEditCategoryId(prod.category.id);
    setEditPrice(String(prod.basePrice));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      await updateProduct(editingProduct.id, {
        categoryId: editCategoryId,
        slug: editSlug.trim().toLowerCase(),
        name: editName.trim(),
        description: editDescription.trim() || null,
        imageUrl: editImageUrl.trim() || null,
        basePrice: Number(editPrice),
        active: editingProduct.active,
      });
      setSuccess(`Prenda "${editName}" actualizada correctamente.`);
      setEditingProduct(null);
      await loadData();
    } catch {
      setError('No fue posible actualizar el producto. Verifica los campos requeridos y que el slug sea único.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeactivate = async (id: string, productName: string) => {
    if (!window.confirm(`¿Desactivar la prenda "${productName}"? Ya no será visible en el catálogo público.`)) return;
    try {
      await deactivateProduct(id);
      await loadData();
    } catch {
      setError('No fue posible desactivar el producto.');
    }
  };

  const totalVentas = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <section>
      <div className="card">
        <p className="eyebrow">Gestión Operativa</p>
        <h1 className="serif-title" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>Panel administrativo</h1>
        <p style={{ color: '#78716C', margin: 0 }}>Resumen operativo de CARPIDI.</p>

        <div className="stats-grid-stitch">
          <div className="stat-box-stitch">
            <strong>{products.length}</strong>
            <span>Productos activos</span>
          </div>

          <div className="stat-box-stitch">
            <strong>{orders.length}</strong>
            <span>Pedidos registrados</span>
          </div>

          <div className="stat-box-stitch">
            <strong>{money.format(totalVentas)}</strong>
            <span>Ventas acumuladas</span>
          </div>
        </div>

        {error && <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>{error}</div>}
        {success && <div className="alert-success" role="status" style={{ marginBottom: '1.5rem' }}>{success}</div>}
        {loading && <div className="loading-state">Sincronizando datos con el backend…</div>}
      </div>

      {/* Modal / Formulario de Edición de Producto */}
      {editingProduct && (
        <div className="card" style={{ border: '2px solid #8B395A', background: '#FFFCFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <p className="eyebrow" style={{ color: '#8B395A' }}>Modo Edición</p>
              <h2 className="serif-title" style={{ fontSize: '1.5rem', margin: 0 }}>Editar: {editingProduct.name}</h2>
            </div>
            <button
              type="button"
              className="link-button"
              style={{ color: '#78716C', fontSize: '0.85rem' }}
              onClick={() => setEditingProduct(null)}
            >
              Cancelar
            </button>
          </div>

          <form className="form-stitch" onSubmit={handleUpdateProduct}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <label>
                Nombre comercial
                <input
                  required
                  maxLength={160}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </label>

              <label>
                Slug (URL amigable)
                <input
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  value={editSlug}
                  onChange={e => setEditSlug(e.target.value.toLowerCase())}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <label>
                Categoría
                <select required value={editCategoryId} onChange={e => setEditCategoryId(e.target.value)}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Precio base (COP)
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                />
              </label>
            </div>

            <label>
              URL de imagen (opcional)
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editImageUrl}
                onChange={e => setEditImageUrl(e.target.value)}
              />
            </label>

            <label>
              Descripción detallada
              <textarea
                maxLength={4000}
                rows={3}
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
              />
            </label>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="button-stitch" type="submit" disabled={updating}>
                {updating ? 'Guardando cambios…' : 'Guardar Cambios'}
              </button>
              <button className="secondary-stitch" type="button" onClick={() => setEditingProduct(null)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Creación de Categorías */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="serif-title" style={{ fontSize: '1.5rem', margin: '0 0 0.25rem' }}>Categorías del Catálogo</h2>
            <p style={{ color: '#78716C', margin: 0, fontSize: '0.85rem' }}>{categories.length} categorías registradas.</p>
          </div>
          <button
            type="button"
            className="secondary-stitch"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
          >
            {showCategoryForm ? 'Cerrar formulario' : '+ Nueva categoría'}
          </button>
        </div>

        {showCategoryForm && (
          <form className="form-stitch" onSubmit={handleCreateCategory} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #ECE6DE' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <label>
                Nombre de categoría
                <input
                  required
                  placeholder="Ej. Vestidos de Noche"
                  value={newCategoryName}
                  onChange={e => {
                    setNewCategoryName(e.target.value);
                    if (!newCategorySlug) {
                      setNewCategorySlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                />
              </label>
              <label>
                Slug
                <input
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  placeholder="ej. vestidos-de-noche"
                  value={newCategorySlug}
                  onChange={e => setNewCategorySlug(e.target.value.toLowerCase())}
                />
              </label>
            </div>
            <button className="button-stitch" type="submit" disabled={creatingCategory} style={{ justifySelf: 'start', marginTop: '0.5rem' }}>
              {creatingCategory ? 'Creando…' : 'Crear categoría'}
            </button>
          </form>
        )}
      </div>

      {/* Formulario de Crear Producto */}
      <div className="card">
        <h2 className="serif-title" style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Crear producto e inventario</h2>
        <p className="subtitle">Registra la información comercial, fotografía y al menos una variante vendible.</p>

        <form className="form-stitch" onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <label>
              Nombre comercial
              <input
                required
                maxLength={160}
                placeholder="Ej. Gorra urbana negra"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>

            <label>
              Slug (URL amigable)
              <input
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                placeholder="ej. gorra-urbana-negra"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase())}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <label>
              Categoría
              <select required value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>

            <label>
              Precio base (COP)
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                placeholder="59900"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </label>
          </div>

          <label>
            URL de imagen fotográfica (opcional)
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </label>

          <label>
            Descripción detallada
            <textarea
              required
              maxLength={4000}
              placeholder="Describe el material, la ocasión de uso, corte y características..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          <fieldset className="variants-editor-box">
            <legend style={{ padding: '0 0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#57534E' }}>
              Variantes e inventario vendible
            </legend>

            {variants.map((variant, index) => (
              <div key={index} style={{ padding: '1rem', background: '#FFFFFF', border: '1px solid #ECE6DE', borderRadius: '4px', display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#1C1917' }}>
                    Variante #{index + 1}
                  </span>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      className="link-button"
                      style={{ color: '#991B1B', fontSize: '0.72rem' }}
                      onClick={() => setVariants(curr => curr.filter((_, pos) => pos !== index))}
                    >
                      Quitar variante
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  <input
                    required
                    pattern="[A-Za-z0-9_-]+"
                    maxLength={80}
                    placeholder="SKU · GOR-NEG-UNI"
                    value={variant.sku}
                    onChange={e => updateVariant(index, 'sku', e.target.value.toUpperCase())}
                  />
                  <input
                    maxLength={30}
                    placeholder="Talla · Única / S / M"
                    value={variant.size}
                    onChange={e => updateVariant(index, 'size', e.target.value)}
                  />
                  <input
                    maxLength={50}
                    placeholder="Color · Negro / Arena"
                    value={variant.color}
                    onChange={e => updateVariant(index, 'color', e.target.value)}
                  />
                  <input
                    min="0.01"
                    step="0.01"
                    type="number"
                    placeholder="Precio (usa base si vacío)"
                    value={variant.price}
                    onChange={e => updateVariant(index, 'price', e.target.value)}
                  />
                  <input
                    required
                    min="0"
                    step="1"
                    type="number"
                    placeholder="Cantidad stock"
                    value={variant.available}
                    onChange={e => updateVariant(index, 'available', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <button
              className="secondary-stitch"
              type="button"
              onClick={() => setVariants(curr => [...curr, emptyVariant()])}
              style={{ justifySelf: 'start' }}
            >
              + Agregar otra talla o color
            </button>
          </fieldset>

          <button
            className="button-stitch"
            type="submit"
            disabled={submitting}
            style={{ justifySelf: 'start', marginTop: '0.5rem' }}
          >
            {submitting ? 'Creando producto…' : 'Crear producto'}
          </button>
        </form>
      </div>

      {/* Tabla de Productos Publicados con Acciones */}
      <div className="card">
        <h2 className="serif-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Productos publicados</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ECE6DE', textAlign: 'left', color: '#78716C', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Foto</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Nombre</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Categoría</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Precio Base</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Inventario Total</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #FAF8F5' }}>
                  <td style={{ padding: '0.5rem' }}>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#ECE6DE', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>{product.name}</td>
                  <td style={{ padding: '0.85rem 0.5rem', color: '#57534E' }}>{product.category.name}</td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>{money.format(product.basePrice)}</td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>
                    {product.variants.reduce((tot, v) => tot + v.available, 0)} unidades
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="link-button"
                        style={{ color: '#1C1917', fontWeight: 600, fontSize: '0.75rem' }}
                        onClick={() => startEditProduct(product)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link-button"
                        style={{ color: '#991B1B', fontWeight: 600, fontSize: '0.75rem' }}
                        onClick={() => handleDeactivate(product.id, product.name)}
                      >
                        Desactivar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
