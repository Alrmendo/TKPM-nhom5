import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'diw0acowj',
  api_key: process.env.CLOUDINARY_API_KEY || '886573185242367',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Msf0xkATAMQBwGsjWNhkBIVnR38',
  secure: process.env.CLOUDINARY_SECURE === 'true' || true,
}));
