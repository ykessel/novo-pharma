import { create } from 'zustand';
import type { Product } from '../types/product';

interface CartLine {
  product: Product;
  quantity: number;
  prescriptionId?: string;
}

interface CartState {
  lines: CartLine[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  attachPrescription: (productId: string, prescriptionId: string) => void;
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
  removeItem: (productId) =>
    set((state) => ({ lines: state.lines.filter((line) => line.product.id !== productId) })),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      lines: quantity <= 0
        ? state.lines.filter((line) => line.product.id !== productId)
        : state.lines.map((line) => (line.product.id === productId ? { ...line, quantity } : line)),
    })),
  attachPrescription: (productId, prescriptionId) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.product.id === productId ? { ...line, prescriptionId } : line,
      ),
    })),
  itemCount: () => get().lines.reduce((total, line) => total + line.quantity, 0),
}));
