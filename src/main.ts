import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { seedProfiles } from './profiles/seed/profiles.seed';
import { Profile } from './profiles/schema/profile.schema';
import { Model } from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const profileModel = app.get<Model<Profile>>(getModelToken(Profile.name));
  await seedProfiles(profileModel);

  const config = new DocumentBuilder()
    .setTitle('User Profile API')
    .setDescription('API para gestionar usuarios y perfiles')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
