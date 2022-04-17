import mongoose from 'mongoose';

const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log('Already connected.');
    return;
  }
  mongoose.connect(process.env.MONGODB_URL!, (err) => {
    if (err) {
      console.log('trying to connect mongodb url', process.env.MONGODB_URL);
      throw err;
    }
    console.log('Connected to mongodb.');
  });
};

export default connectDB;
