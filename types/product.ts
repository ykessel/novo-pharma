export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  dosage: string;
  priceCents: number;
  imageUrl: string;
  requiresRx: boolean;
  stock: number;
  category: string;
  rating: number;
  reviewCount: number;
  originalPriceCents?: number;
}
