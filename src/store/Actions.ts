import { Product } from '@/models/productModel';

import { CartEvent, NotificationEvent } from './GlobalStore';

import { Notify } from '@/types';
import { CartItem } from '@/types/CartItem';

export const addToCart = (
  product: Product,
  cart: CartItem[]
):
  | {
      type: NotificationEvent.NOTIFY;
      payload: {
        notify: Notify;
      };
    }
  | {
      type: CartEvent.ADD;
      payload: {
        cart: CartItem[];
      };
    } => {
  if (product.inStock === 0)
    return {
      type: NotificationEvent.NOTIFY,
      payload: { notify: { error: 'This product is out of stock.' } },
    };

  const check = cart.every((item) => {
    return item._id !== product._id;
  });

  if (!check)
    return {
      type: NotificationEvent.NOTIFY,
      payload: { notify: { error: 'The product has been added to cart.' } },
    };

  return {
    type: CartEvent.ADD,
    payload: { cart: [...cart, { ...product, quantity: 1 }] },
  };
};

export const decrease = (data: CartItem[], id: number) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity -= 1;
  });

  return { type: CartEvent.ADD, payload: { cart: newData } };
};

export const increase = (data: CartItem[], id: number) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity += 1;
  });

  return { type: CartEvent.ADD, payload: { cart: newData } };
};
