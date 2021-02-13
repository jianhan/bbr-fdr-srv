import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './env.validation';
import { SeasonSummariesModule } from './season-summaries/season-summaries.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConnectionString } from './functions';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.testing', '.env.staging', '.env.production'],
      isGlobal: true,
      cache: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: getMongoConnectionString(configService),
        useFindAndModify: true,
      }),
      inject: [ConfigService],
    }),
    SeasonSummariesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
