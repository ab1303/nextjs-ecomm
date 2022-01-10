import mongoose from 'mongoose';

const uri = process.env.MONGODB_URL!;

let clientPromise;

if (!process.env.MONGODB_URL) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = mongoose.connect(uri);
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = mongoose.connect(uri);
}

export default clientPromise;
