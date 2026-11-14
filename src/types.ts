export interface Env {
  DB: D1Database;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  PUBLIC_WHATSAPP_NUMBER?: string;
}

export type UserRole = 'admin' | 'staff';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
}

export interface ProductFormData {
  name: string;
  brand: string;
  modelCode?: string;
  category: string;
  gender: string;
  frameMaterial?: string;
  frameShape?: string;
  color: string;
  dimensions?: string;
  price?: number;
  priceOnRequest: boolean;
  status: string;
  description?: string;
  isWeeklyFeature: boolean;
  images: string[];
}
