import { Link, Route, Routes } from 'react-router-dom';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
export function App(){return <><header><Link to="/">CARPIDI</Link><nav><Link to="/catalogo">Catálogo</Link><Link to="/carrito">Carrito</Link></nav></header><main><Routes><Route path="/" element={<CatalogPage/>}/><Route path="/catalogo" element={<CatalogPage/>}/><Route path="/productos/:id" element={<ProductPage/>}/><Route path="/carrito" element={<CartPage/>}/></Routes></main></>}
