
import { Product } from "../data/products";

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  email: string;
}

export interface Address {
  id: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NewAddressFormData {
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
