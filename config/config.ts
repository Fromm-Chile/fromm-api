import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    jwtSecret: process.env.SECRET_VALUE,
    KEY: process.env.KEY,
  };
});
