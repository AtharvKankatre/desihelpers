import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from '@fastify/compress';

import { AppModule } from './app.module';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Nanny')
    .setDescription('Helpers API')
    .setVersion('1.0')
    .addTag('Nanny')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.register(compression, {
    global: true,
    zlibOptions: {
      level: 6,
    },
    threshold: 512,
    encodings: ['gzip', 'deflate'],
  });

  // Check MongoDB connection status
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    console.log('\n========================================');
    console.log('✅ DATABASE: MongoDB connected successfully');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log('========================================\n');
  } else {
    console.log('\n========================================');
    console.log('❌ DATABASE: MongoDB NOT connected');
    console.log(`   Connection state: ${dbState}`);
    console.log('========================================\n');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log('========================================');
  console.log('🚀 SERVER: DesiHelpers Backend is running!');
  console.log(`   URL: http://localhost:${port}`);
  console.log(`   Swagger: http://localhost:${port}/api`);
  console.log('========================================\n');
}

//AppClusterService.clusterize(bootstrap);
bootstrap();
