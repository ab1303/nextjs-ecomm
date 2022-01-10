import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import Users from '@/models/userModel';
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
      authorize: async (credentials, req) => {
        try {
          console.log('credentials', credentials);

          if (!credentials) return null;

          const user = await Users.findById(credentials.email);

          console.log('found user', user);
        } catch (err: any) {
          return { err: err.message };
        }

        return null;
      },
    }),
  ],
  // pages: {},
  secret: process.env.ACCESS_TOKEN_SECRET,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
  },
});
