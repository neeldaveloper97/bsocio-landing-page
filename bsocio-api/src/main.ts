import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('/home/ubuntu/certs/key.pem'),
  //   cert: fs.readFileSync('/home/ubuntu/certs/cert.pem'),
  // };

  // const app = await NestFactory.create(AppModule, { httpsOptions });
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // Global validation (DTO validation everywhere)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws on unknown properties
      transform: true, // transforms payloads to DTO classes
    }),
  );

  // CORS for Admin Dashboard
  // app.enableCors({
  //   origin: corsOrigin.split(',').map((s) => s.trim()),
  //   credentials: true,
  // });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id'],
    credentials: true,
  });

  // Swagger (HARSH RULE: ALWAYS ON)
  const swaggerPath = configService.get<string>('SWAGGER_PATH') ?? 'docs';
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bsocio API')
    .setDescription('Admin Dashboard Backend API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = configService.get<number>('PORT') || 3333;
  const nodeEnv = configService.get<string>('NODE_ENV') ?? '';
  await app.listen(port);

  if (nodeEnv === 'development') {
  }
  console.log(`Environment: ${nodeEnv}`);
  console.log(`API: http://localhost:${port}`);

  console.log(`Swagger: http://localhost:${port}/${swaggerPath}`);
}
bootstrap();
