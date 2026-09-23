import { AxiosError } from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, getCategories, getProducts, Product } from '../services/catalog';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function CatalogPage() {
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

  return <section>
    <h1>Moda para ti</h1>
    <p>Ropa, zapatos y accesorios. La asesoría de imagen es opcional.</p>
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
      {products.map(product => <article key={product.id}>
        <div className="placeholder" aria-hidden="true" />
        <p className="eyebrow">{product.category.name}</p>
        <h2>{product.name}</h2>
        <p>{money.format(product.basePrice)}</p>
        <Link to={`/productos/${product.id}`}>Ver producto</Link>
      </article>)}
    </div>
  </section>;
}
