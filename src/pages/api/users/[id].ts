import { NextApiRequest, NextApiResponse } from 'next';

import Users from '@/models/userModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';

connectDB();

export default async function handleUserRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PATCH':
      await setUserStatus(req, res);
      break;
    case 'DELETE':
      await deleteUser(req, res);
      break;
  }
}

export type UserDTO = {
  _id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  country: string;
  active: boolean;
};

export type UsersResponse = {
  users: Array<UserDTO>;
};

export type UserResponse = {
  user: UserDTO;
};

const setUserStatus = async (
  req: NextApiRequest,
  res: NextApiResponse<UserResponse | Notify>
) => {
  try {
    const { id } = req.query;

    const user = await Users.findById(id);
    if (!user) return res.status(400).json({ error: 'User not found.' });

    user.active = !user.active;
    const status = user.active ? 'enabled.' : 'disabled.';

    await user.save();
    res.json({ success: 'User account successfully' + status });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};

const deleteUser = async (
  req: NextApiRequest,
  res: NextApiResponse<UserResponse | Notify>
) => {
  try {
    const { id } = req.query;

    const user = await Users.findById(id);
    if (!user) return res.status(400).json({ error: 'User not found.' });

    await Users.deleteOne(user);

    res.json({ success: 'User Deleted Successfully!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
