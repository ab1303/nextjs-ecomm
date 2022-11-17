module.exports = {
  env: {
    // REFRESH_TOKEN_SECRET: 'YOUR_REFRESH_TOKEN_SECRET',
    // PAYPAL_CLIENT_ID: 'YOUR_PAYPAL_CLIENT_ID',
  },
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
  serverRuntimeConfig: {
    API_URL: process.env.API_URL,
  },
  // Will be available on both server and client
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
