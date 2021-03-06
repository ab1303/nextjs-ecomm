import mongoose from 'mongoose';

export interface Menu {
  _id: number;
  title: string;
  image: string;
  description: string;
  category: string;
  price: number;
}

export interface AddressModel {
  addressLine: string;
  streetAddress: string;
  suburb: string;
  postcode: string;
  state: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  image: string;
  thumbnail: string;
  address: AddressModel;
  cuisine: string;
  contact: string;
  categories: Array<{ id: string }>;
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
    required: false,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: false,
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
    required: false,
  },
  deliveryFee: {
    type: Number,
    required: false,
  },
  categories: [
    {
      id: {
        type: String,
        required: true,
      },
    },
  ],
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
