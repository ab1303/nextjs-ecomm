import { Product } from '../models/productModel';

export interface CartItem extends Product {
  quantity: number;
}
