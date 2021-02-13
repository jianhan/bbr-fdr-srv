import { plainToClass } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty()
  MONGODB_DATABASE: string;

  @IsNotEmpty()
  MONGODB_USERNAME: string;

  @IsNotEmpty()
  MONGODB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  MONGODB_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  MONGODB_PORT: number;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  CACHE_TTL: number;

  @IsNotEmpty()
  @IsNumber()
  CACHE_MAX_ITEMS: number;

  @IsNotEmpty()
  @IsNumber()
  MINIMAL_YEAR: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
