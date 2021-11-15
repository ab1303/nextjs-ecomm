import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

import Users from '@/models/userModel';
import connectDB from '@/utils/connectDB';
import { createAccessToken } from '@/utils/generateToken';

import AuthPayloadType from '@/types/AuthPayloadType';

connectDB();

const accessToken = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ err: 'Please login now!' });

    const result = jwt.verify(
      rf_token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as AuthPayloadType;
    if (!result)
      return res
        .status(400)
        .json({ err: 'Your token is incorrect or has expired.' });

    const user = await Users.findById(result.id);
    if (!user) return res.status(400).json({ err: 'User does not exist.' });

    const access_token = createAccessToken({ id: user._id });
    res.json({
      access_token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

export default accessToken;
