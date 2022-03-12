import mongoose from 'mongoose';

export interface Category {
  _id: number;
  name: string;
  isActive: boolean;
  restaurants: Array<{ id: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const CategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    restaurants: [
      {
        id: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Dataset =
  mongoose.models.categories || mongoose.model('categories', CategoriesSchema);
export default Dataset;
