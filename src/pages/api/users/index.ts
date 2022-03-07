import { Query } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import Users, { User } from '@/models/userModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';

connectDB();

export default async function handleUserRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getUsers(req, res);
      break;
  }
}

class APIfeatures {
  query: any;
  queryString: {
    [key: string]: string | string[];
  };
  constructor(
    query: Query<any[], any, Record<string, unknown>, any>,
    queryString: {
      [key: string]: string | string[];
    }
  ) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = !Array.isArray(this.queryString.page)
      ? this.queryString.page
        ? +this.queryString.page * 1
        : 1
      : 1;

    const limit =
      !Array.isArray(this.queryString.limit) || !this.queryString.limit
        ? this.queryString.limit
          ? +this.queryString.limit * 1
          : 6
        : 6;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
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

const getUsers = async (
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse | Notify>
) => {
  try {
    const features = new APIfeatures(Users.find({ role: 'user' }), req.query);

    const users: User[] = await features.query;

    const result: Array<UserDTO> = users.map((r) => ({
      _id: r._id,
      firstname: r.firstName,
      lastname: r.lastName,
      email: r.email,
      phone: r.phone,
      country: r.county,
      active: r.active,
    }));

    res.json({
      users: result,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
