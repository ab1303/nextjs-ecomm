/* eslint-disable no-console */
import mongoose, { CallbackError } from 'mongoose';

const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log('Already connected.');
    return;
  }
  mongoose.connect(
    process.env.MONGODB_URL!,
    { directConnection: true },
    (err: CallbackError) => {
      if (err) {
        console.log('trying to connect mongodb url', process.env.MONGODB_URL);
        console.log('error reason', JSON.stringify(err, null, 2));
        throw err;
      }
      console.log('Connected to mongodb.');
    }
  );
};

export default connectDB;
