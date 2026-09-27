import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Product, ProductVariant } from '../services/catalog';

export type CartItem = {
  productId: string;
  productName: string;
  variantId: string;
  size?: string;
  color?: string;
  price: number;
  available: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  total: number;
  addItem: (product: Product, variant: ProductVariant) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const loadCart = () => {
  const raw = localStorage.getItem('cartItems');
  if (!raw) return [];
  return (JSON.parse(raw) as Array<Omit<CartItem, 'available'> & { available?: number }>).map(item => ({
    ...item,
    available: typeof item.available === 'number' ? item.available : Math.max(item.quantity, 1),
  }));
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    addItem(product, variant) {
      setItems(current => {
        const existing = current.find(item => item.variantId === variant.id);
        if (existing) {
          return current.map(item => item.variantId === variant.id
            ? { ...item, quantity: Math.min(item.quantity + 1, variant.available) }
            : item);
        }
        return [...current, {
          productId: product.id,
          productName: product.name,
          variantId: variant.id,
          size: variant.size ?? undefined,
          color: variant.color ?? undefined,
          price: variant.price,
          available: variant.available,
          quantity: 1,
        }];
      });
    },
    updateQuantity(variantId, quantity) {
      setItems(current => current.map(item => item.variantId === variantId
        ? { ...item, quantity: Math.min(item.available, Math.max(1, quantity)) }
        : item));
    },
    removeItem(variantId) {
      setItems(current => current.filter(item => item.variantId !== variantId));
    },
    clear() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart debe usarse dentro de CartProvider.');
  return value;
}
