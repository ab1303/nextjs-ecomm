import { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest & NextApiRequest) {
  const session = await getToken({
    req,
    secret: process.env.ACCESS_TOKEN_SECRET!,
    secureCookie: process.env.NODE_ENV === 'production',
  });
  // You could also check for any property on the session object,
  // like role === "admin" or name === "John Doe", etc.
  if (session && session.user.role === 'user')
    return NextResponse.redirect('/home');

  // If user is authenticated, continue.
  return NextResponse.next();
}
