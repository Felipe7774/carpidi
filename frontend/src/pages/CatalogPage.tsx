import { AxiosError } from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Category, getCategories, getProducts, Product } from '../services/catalog';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function CatalogPage() {
  const isHome = useLocation().pathname === '/';
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => { void loadCatalog('', ''); }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loadCatalog();
  };

  return <section className={isHome ? 'catalog-home' : ''}>
    {isHome && <><section className="hero"><div className="hero-content"><p className="eyebrow">Nueva temporada</p><h1>Viste tu <em>propia</em> versión.</h1><p className="hero-copy">Moda femenina para construir un estilo que se siente tan auténtico como tú.</p><div className="button-row"><a className="button button-light" href="#novedades">Explorar novedades</a><Link className="button button-outline" to="/estilo">Encuentra tu estilo</Link></div></div></section><section className="home-intro"><div><p className="eyebrow">CARPIDI, moda con intención</p><h2>Menos ruido.<br/>Más tú.</h2></div><p>Explora ropa, zapatos y accesorios a tu ritmo. La asesoría de estilo es opcional y está disponible cuando la necesites.</p></section><section className="category-grid"><Link className="category-link" to="/catalogo"><span>01</span><strong>Ropa</strong><span>↗</span></Link><Link className="category-link" to="/catalogo"><span>02</span><strong>Zapatos</strong><span>↗</span></Link><Link className="category-link" to="/catalogo"><span>03</span><strong>Accesorios</strong><span>↗</span></Link></section></>}
    <section className="catalog-section" id="novedades"><div className="catalog-heading"><div><p className="eyebrow">{isHome ? 'Selección de temporada' : 'Todo el catálogo'}</p><h2>{isHome ? 'Recién llegado' : 'Encuentra tu próxima pieza'}</h2></div></div>
    <form className="filters" onSubmit={onSubmit}>
      <input aria-label="Buscar productos" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar prendas" />
      <select aria-label="Filtrar por categoría" value={category} onChange={event => setCategory(event.target.value)}>
        <option value="">Todas las categorías</option>
        {categories.map(item => <option key={item.id} value={item.slug}>{item.name}</option>)}
      </select>
      <button type="submit">Filtrar</button>
    </form>
    {loading && <p role="status">Cargando catálogo…</p>}
    {error && <p className="error" role="alert">{error}</p>}
    {!loading && !error && products.length === 0 && <p className="empty">Aún no hay productos publicados. El catálogo ya está conectado a la API.</p>}
    <div className="grid">
      {products.map(product => <article className="product-card" key={product.id}>
        <div className="placeholder" aria-hidden="true" />
        <p className="eyebrow">{product.category.name}</p>
        <h2>{product.name}</h2>
        <p className="price">{money.format(product.basePrice)}</p>
        <Link to={`/productos/${product.id}`}>Ver producto</Link>
      </article>)}
    </div>
    </section></section>;
}
