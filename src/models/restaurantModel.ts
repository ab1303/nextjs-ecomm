import mongoose from 'mongoose';

import { Address } from '@/types';

export interface Menu {
  _id: number;
  title: string;
  image: string;
  description: string;
  category: string;
  price: number;
}

export interface Restaurant {
  _id: number;
  name: string;
  image: string;
  address: Address;
  cuisine: string;
  contact: string;
  category: string;
  deliveryFee: number;
  menu: Menu[];
}

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    addressLine: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    suburb: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  cuisine: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  menu: [
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      image: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Dataset =
  mongoose.models.restaurant || mongoose.model('restaurant', restaurantSchema);
export default Dataset;
