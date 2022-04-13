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

          const user: User | null | undefined = await Users.findOne({
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

          return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          };
        } catch (err: any) {
          return { err: err.message };
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
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
