import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...dbConfig,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
