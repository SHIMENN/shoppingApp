import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(cookieParser()); 

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.enableCors({
    origin: 'http://localhost:3000', // Vite dev server
    credentials: true, //  ל בושח-Cookies!
  });

  const PORT = process.env.PORT || 5173;
 await app.listen(PORT, () => {
    console.log(`--- 🚀 מאזין בכתובת: http://localhost:${PORT} ---`);
  });
}

bootstrap();

