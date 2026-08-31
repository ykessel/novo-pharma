import { create } from 'zustand';
import type { Product } from '../types/product';

interface CartLine {
  product: Product;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  addItem: (product: Product) => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.lines.find((line) => line.product.id === product.id);
      if (existing) {
        return {
          lines: state.lines.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        };
      }
      return { lines: [...state.lines, { product, quantity: 1 }] };
    }),
  itemCount: () => get().lines.reduce((total, line) => total + line.quantity, 0),
}));
