import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
// only for typeorm cli
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

type config_fn = (
  // eslint-disable-next-line no-unused-vars
  configService?: ConfigService,
  // eslint-disable-next-line no-unused-vars
  overrideHost?: string,
) => DataSourceOptions;

const config: config_fn = (configService, overrideHost) => {
  const configServices = configService || new ConfigService();
  const dbName = configServices.get<string>('POSTGRES_DATABASE');
  const dbPrefix = configServices.get<string>('POSTGRES_PREFIX');
  const { NODE_ENV } = process.env;
  const configs: DataSourceOptions = {
    type: configServices.get<'postgres'>('DB_TYPE'),
    host: overrideHost || configServices.get<string>('POSTGRES_HOST'),
    port: configServices.get<number>('POSTGRES_PORT'),
    username: configServices.get<string>('POSTGRES_USER'),
    password: configServices.get<string>('POSTGRES_PASSWORD'),
    database: dbPrefix ? `${dbPrefix}_${dbName}` : dbName,
    entities:
      NODE_ENV === 'test'
        ? ['src/**/*.entity{.js,.ts}']
        : ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: configServices.get<string>('TYPEORM_SYNC') === 'true',
    logging: configServices.get<string>('TYPEORM_LOGGING') === 'true',
    migrationsRun: configServices.get<string>('RUN_MIGRATIONS') === 'true',
    migrationsTransactionMode: 'each',
    dropSchema: configServices.get<string>('DROP_SCHEMA') === 'true',
  };

  return configs;
};
export default config;
