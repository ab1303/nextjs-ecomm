import mongoose from 'mongoose';

import { User } from './userModel';

export interface Order {
  _id: number;
  user: User;
  address: string;
  mobile: string;
  // TODO:
  // cart: Array;
  total: number;
  paymentId: string;
  method: string;
  delivered: boolean;
  paid: boolean;
  dateOfPayment: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    address: String,
    mobile: String,
    cart: Array,
    total: Number,
    paymentId: String,
    method: String,
    delivered: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    dateOfPayment: Date,
  },
  {
    timestamps: true,
  }
);

const Dataset = mongoose.models.order || mongoose.model('order', orderSchema);
export default Dataset;
