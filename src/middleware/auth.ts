import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

import Users from '@/models/userModel';

import AuthPayloadType from '@/types/AuthPayloadType';

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ err: 'Invalid Authentication.' });

  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as AuthPayloadType;
  if (!decoded) return res.status(400).json({ err: 'Invalid Authentication.' });

  const user = await Users.findOne({ _id: decoded.id! });

  return { id: user._id, role: user.role, root: user.root };
};

export default auth;
