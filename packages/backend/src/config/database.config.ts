import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb+srv://enchanted:2zlpDUeMpcTvv4X7@enchanted.ss8ztcz.mongodb.net/',
}));
