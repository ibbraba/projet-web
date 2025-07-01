import { execSync } from 'child_process';

import { config } from 'dotenv';

config({ path: '.env.test' }); // loads the test DB


module.exports = () => {
 
  config({ path: '.env.test' });

  console.log("DB file : ", process.env.DATABASE_URL);
  
  // Optional: reset your test DB
  execSync('npx prisma migrate reset --force --skip-generate --schema=./prisma/schema.prisma', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });
};

