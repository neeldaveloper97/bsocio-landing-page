import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvVars {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_EXPIRES_IN!: string;

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;

  @IsString()
  @IsOptional()
  FRONTEND_URL?: string;

  @IsString()
  @IsOptional()
  MAIL_DOMAIN?: string;

  @IsString()
  @IsOptional()
  MAIL_FROM?: string;

  @IsString()
  @IsOptional()
  BACKEND_URL_DEV?: string;

  @IsString()
  @IsOptional()
  BACKEND_URL_PROD?: string;

  @IsString()
  @IsOptional()
  SWAGGER_PATH?: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, {
    ...config,
    PORT: config.PORT ? Number(config.PORT) : 3000,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length) {
    const messages = errors
      .map((e) => Object.values(e.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`ENV validation error: ${messages}`);
  }

  return validated;
}
