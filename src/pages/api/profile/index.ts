import type { NextApiRequest, NextApiResponse } from 'next';

import Users from '@/models/userModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';

connectDB();

const updateProfileHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      await updateProfile(req, res);
      break;
  }
};

const updateProfile = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const { firstname, lastname, email } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found.' });

    user.firstName = firstname;
    user.lastName = lastname;

    await user.save();
    res.json({ success: 'Profile Update Successful!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};

export default updateProfileHandler;
