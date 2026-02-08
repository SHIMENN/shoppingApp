import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
   app.use(cookieParser()); 

    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));


    app.enableCors({
    origin:[
      process.env.FRONTEND_URL,
    'http://192.168.1.34:5173',
   'http://10.56.245.65:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, //  ל בושח-Cookies!
  });


 const config = new DocumentBuilder()
  .setTitle('My API')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
  )
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  

  const PORT = process.env.PORT || 3000;
 await app.listen(PORT, '0.0.0.0');
console.log(`--- 🚀 מאזין בכתובת: http://localhost:${PORT} ---`);
  }


bootstrap();

