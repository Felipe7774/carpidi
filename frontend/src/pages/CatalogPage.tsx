import { AxiosError } from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Category, getCategories, getProducts, Product } from '../services/catalog';
import { useCart } from '../state/CartContext';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function CatalogPage() {
  const location = useLocation();
  const { addItem } = useCart();
  const isHome = location.pathname === '/';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedMessage, setAddedMessage] = useState('');

  const loadCatalog = async (selectedQuery = query, selectedCategory = category) => {
    setLoading(true);
    setError('');
    try {
      const [catalogCategories, page] = await Promise.all([
        categories.length ? Promise.resolve(categories) : getCategories(),
        getProducts({ q: selectedQuery || undefined, category: selectedCategory || undefined }),
      ]);
      setCategories(catalogCategories);
      setProducts(page.content);
    } catch (cause) {
      const status = cause instanceof AxiosError ? cause.response?.status : undefined;
      setError(status ? `No fue posible cargar el catálogo (HTTP ${status}).` : 'No fue posible conectar con CARPIDI API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog('', '');
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loadCatalog();
  };

  const onSelectCategoryChip = (slug: string) => {
    setCategory(slug);
    void loadCatalog(query, slug);
  };

  const handleQuickAdd = (product: Product) => {
    const variant = product.variants.find(v => v.available > 0) ?? product.variants[0];
    if (!variant || variant.available < 1) {
      setAddedMessage(`La prenda ${product.name} no tiene unidades disponibles en este momento.`);
      return;
    }
    addItem(product, variant);
    setAddedMessage(`Agregaste ${product.name} (${variant.size ?? 'Única'}) a tu bolsa.`);
    setTimeout(() => setAddedMessage(''), 4000);
  };

  return (
    <section>
      {isHome && (
        <section className="stitch-hero">
          <span className="hero-badge">Tu estilo, a tu manera</span>
          <h1 className="hero-headline serif-title">Encuentra prendas que realmente van contigo</h1>
          <p className="hero-subhead">
            Descubre piezas exclusivas diseñadas con tejidos nobles, cortes contemporáneos y asesoría de imagen personalizada según tu morfología y estilo personal.
          </p>
          <div className="hero-cta-group">
            <a href="#catalogo-section" className="button-stitch">Explorar Colección</a>
            <Link to="/estilo" className="secondary-stitch">Descubrir Mi Estilo</Link>
          </div>
          <div className="hero-pillars">
            <div className="pillar-item">100% Fibras Naturales</div>
            <div className="pillar-item">Atelier Edición Limitada</div>
            <div className="pillar-item">Boutique Asesoría 1:1</div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <div className="category-curation">
          <p className="eyebrow">Curaduría de Armario</p>
          <h3>Explorar por Categoría</h3>
          <div className="category-chips">
            <button
              type="button"
              className={`category-chip ${category === '' ? 'active' : ''}`}
              onClick={() => onSelectCategoryChip('')}
            >
              Todas las prendas
            </button>
            {categories.map(item => (
              <button
                type="button"
                key={item.id}
                className={`category-chip ${category === item.slug ? 'active' : ''}`}
                onClick={() => onSelectCategoryChip(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div id="catalogo-section" className="catalog-header">
        <p className="eyebrow">Todo el Catálogo</p>
        <h2 className="serif-title">Encuentra tu próxima pieza</h2>
      </div>

      <form className="catalog-filter-bar" onSubmit={onSubmit}>
        <input
          aria-label="Buscar productos"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Buscar prendas, estilos o materiales..."
        />
        <select
          aria-label="Filtrar por categoría"
          value={category}
          onChange={event => setCategory(event.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(item => (
            <option key={item.id} value={item.slug}>{item.name}</option>
          ))}
        </select>
        <button className="button-stitch" type="submit">Filtrar</button>
      </form>

      {addedMessage && (
        <div className="alert-success" role="status" style={{ marginBottom: '1.5rem' }}>
          {addedMessage} <Link to="/carrito" style={{ fontWeight: 700, marginLeft: '0.5rem', color: 'inherit' }}>Ver bolsa</Link>
        </div>
      )}

      {loading && <div className="loading-state" role="status">Cargando catálogo…</div>}
      {error && <div className="alert-error" role="alert" style={{ marginBottom: '2rem' }}>{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <h3>No se encontraron prendas</h3>
          <p>No hay productos que coincidan con los criterios seleccionados. Prueba limpiando los filtros de búsqueda.</p>
          <button className="secondary-stitch" type="button" onClick={() => { setQuery(''); setCategory(''); void loadCatalog('', ''); }}>
            Limpiar Filtros
          </button>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map(product => (
            <article key={product.id} className="product-card-stitch">
              <div>
                <div className="arched-frame" aria-hidden="true">
                  <span>CARPIDI</span>
                </div>
                <div className="product-meta">
                  <p className="eyebrow">{product.category.name}</p>
                  <h3>{product.name}</h3>
                  <p className="product-price">{money.format(product.basePrice)}</p>
                </div>
              </div>
              <div className="product-actions">
                <Link to={`/productos/${product.id}`} className="secondary-stitch" style={{ padding: '0.65rem 0.75rem', fontSize: '0.7rem' }}>
                  Ver Detalle
                </Link>
                <button
                  type="button"
                  className="button-stitch"
                  style={{ padding: '0.65rem 0.75rem', fontSize: '0.7rem' }}
                  onClick={() => handleQuickAdd(product)}
                >
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
