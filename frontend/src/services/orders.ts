import { api } from './api';

export type CreateOrderItem = {
  variantId: string;
  quantity: number;
};

export type CreateOrderRequest = {
  items: CreateOrderItem[];
  paymentMethod: string;
  shippingAddress: {
    line1: string;
    city: string;
    country: string;
  };
};

export type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    variantId: string;
    productName: string;
    size?: string;
    color?: string;
    quantity: number;
    unitPrice: number;
  }>;
};

export async function createOrder(payload: CreateOrderRequest) {
  const { data } = await api.post<Order>('/orders', payload);
  return data;
}

export async function getOrders() {
  const { data } = await api.get<Order[]>('/orders');
  return data;
}
