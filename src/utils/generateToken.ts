import jwt from 'jsonwebtoken';

import AuthPayloadType from '@/types/AuthPayloadType';

export const createAccessToken = (payload: AuthPayloadType) => {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (payload: AuthPayloadType) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
};
