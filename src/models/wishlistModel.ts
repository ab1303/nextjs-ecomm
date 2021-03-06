import mongoose from 'mongoose';

export interface Wishlist {
  _id: number;
  userId: number;
  restaurants: Array<{ id: string }>;
}

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },

  restaurants: [
    {
      id: {
        type: String,
        required: true,
      },
    },
  ],
});

const Dataset =
  mongoose.models.wishlist || mongoose.model('wishlist', wishlistSchema);
export default Dataset;
