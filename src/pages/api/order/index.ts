import { NextApiRequest, NextApiResponse } from 'next';

import auth from '@/middleware/auth';
import Orders from '@/models/orderModel';
import connectDB from '@/utils/connectDB';

connectDB();

export default async function handleOrderRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      await createOrder(req, res);
      break;
    case 'GET':
      await getOrders(req, res);
      break;
  }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await auth(req, res);

    let orders;
    if (result && result.role !== 'admin') {
      orders = await Orders.find({ user: result.id }).populate(
        'user',
        '-password'
      );
    } else {
      orders = await Orders.find().populate('user', '-password');
    }

    res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await auth(req, res);
    const { address, mobile, cart, total } = req.body;

    if (!result) {
      throw new Error('Authentication error !');
    }

    const newOrder = new Orders({
      user: result.id,
      address,
      mobile,
      cart,
      total,
    });

    await newOrder.save();

    res.json({
      msg: 'Order success! We will contact you to confirm the order.',
      newOrder,
    });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
