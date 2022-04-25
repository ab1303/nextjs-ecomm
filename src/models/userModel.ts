import mongoose from 'mongoose';

export interface User {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  county: string;
  phone: number;
  password: string;
  role: string;
  root: boolean;
  avatar: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    root: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
    },
    active: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Dataset = mongoose.models.user || mongoose.model('user', userSchema);
export default Dataset;
