import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*', // or specify origin(s)
      credentials: true,
    },
  });
  //TODO change to 3000 docker port
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log("App initialized and running on port", process.env.PORT ?? 3000);
  
}

bootstrap();
