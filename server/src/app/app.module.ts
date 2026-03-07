import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InstagramContentModule } from './instagram-content/instagram-content.module';
import { GeminiModule } from 'src/ai/gemini/gemini.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';
import { ImagenModule } from 'src/ai/imagen/imagen.module';

@Module({
  imports: [
    InstagramContentModule,

    GeminiModule,
    CloudinaryModule,
    ImagenModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI")
      }),
      inject:[ConfigService]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
