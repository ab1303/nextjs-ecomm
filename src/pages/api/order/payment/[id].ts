import { NextApiRequest, NextApiResponse } from 'next';

import auth from '@/middleware/auth';
import Orders from '@/models/orderModel';
import connectDB from '@/utils/connectDB';

connectDB();

export default async function handlePaymentRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PATCH':
      await paymentOrder(req, res);
      break;
  }
}

const paymentOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await auth(req, res);

    if (result && result.role === 'user') {
      const { id } = req.query;
      const { paymentId } = req.body;

      await Orders.findOneAndUpdate(
        { _id: id },
        {
          paid: true,
          dateOfPayment: new Date().toISOString(),
          paymentId,
          method: 'Paypal',
        }
      );

      res.json({ msg: 'Payment success!' });
    }
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
