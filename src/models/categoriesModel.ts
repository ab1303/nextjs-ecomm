import mongoose from 'mongoose';

export interface Category {
  _id: number;
  name: string;
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
  },
  {
    timestamps: true,
  }
);

const Dataset =
  mongoose.models.categories || mongoose.model('categories', CategoriesSchema);
export default Dataset;
