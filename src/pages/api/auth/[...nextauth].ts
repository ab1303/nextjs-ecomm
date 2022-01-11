import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import Users, { User } from '@/models/userModel';
import connectDB from '@/utils/connectDB';

connectDB();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) return null;

          const user: User | undefined = await Users.findOne({
            email: credentials.email,
          });

          if (!user) {
            throw new Error('No user found!');
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error('Could not log you in!');
          }

          return { email: user.email };
        } catch (err: any) {
          return { err: err.message };
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.ACCESS_TOKEN_SECRET,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
  },
});
