import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import Users from '@/models/userModel';
import connectDB from '@/utils/connectDB';
import valid from '@/utils/valid';

connectDB();

const registerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await register(req, res);
      break;
  }
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    const errMsg = valid(firstName, lastName, email, password, passwordConfirm);
    if (errMsg) return res.status(400).json({ err: errMsg });

    const user = await Users.findOne({ email });
    if (user)
      return res.status(400).json({ err: 'This email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await newUser.save();
    res.json({ msg: 'Register Success!' });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

export default registerHandler;
