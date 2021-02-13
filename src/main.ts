import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Environment } from './env.validation';
import { LogLevel } from '@nestjs/common';

function getLoggerLevels(env: Environment): LogLevel[] {
  switch (env) {
    case Environment.Test:
    case Environment.Development:
      return ['warn', 'error', 'debug', 'verbose', 'log'];
    case Environment.Staging:
      return ['warn', 'error', 'debug'];
    case Environment.Production:
      return ['warn', 'error'];
  }
}

async function bootstrap() {
  const configApp = await NestFactory.create(AppModule);
  const configService = configApp.get(ConfigService);

  const redisHost = configService.get<string>('REDIS_HOST');
  const redisPort = configService.get<string>('REDIS_PORT');
  const nodeEnv = configService.get<Environment>('NODE_ENV');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: `redis://${redisHost}:${redisPort}`,
      },
      logger: getLoggerLevels(nodeEnv),
    },
  );
  app.listen(() => console.log('Microservice is listening'));
}

bootstrap();
