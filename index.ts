import App from './app';
import { PrismaClient } from '@prisma/client';

async function main() {
  const app = new App();
  app.getServer().listen(3000);
}

export const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
