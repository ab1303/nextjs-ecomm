import mongoose from 'mongoose';

export interface Product {
  _id: number;
  title: string;
  price: number;
  description: string;
  content: string;
  // TODO:
  // images: Array;
  category: string;
  checked: boolean;
  inStock: number;
  sold: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Dataset =
  mongoose.models.product || mongoose.model('product', productSchema);
export default Dataset;
