import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import Users from '@/models/userModel';
import connectDB from '@/utils/connectDB';
import { createAccessToken, createRefreshToken } from '@/utils/generateToken';

connectDB();

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await login(req, res);
      break;
  }
};

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ err: 'This user does not exist.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ err: 'Incorrect password.' });

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    res.json({
      msg: 'Login Success!',
      refresh_token,
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

export default loginHandler;
