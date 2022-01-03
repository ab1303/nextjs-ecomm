module.exports = {
  env: {
    BASE_URL: 'http://localhost:3000',
    MONGODB_URL:
      'mongodb://127.0.0.1:27017/nextjs-ecomm?retryWrites=true&w=majority&connectTimeoutMS=5000',
    ACCESS_TOKEN_SECRET: 'YOUR_ACCESS_TOKEN_SECRET',
    REFRESH_TOKEN_SECRET: 'YOUR_REFRESH_TOKEN_SECRET',
    PAYPAL_CLIENT_ID: 'YOUR_PAYPAL_CLIENT_ID',
    CLOUD_UPDATE_PRESET: 'YOUR_CLOUD_UPDATE_PRESET',
    CLOUD_NAME: 'YOUR_CLOUD_NAME',
    CLOUD_API: 'YOUR_CLOUD_API',
  },
  eslint: {
    dirs: ['src'],
  },
};
