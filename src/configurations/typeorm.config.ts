import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get('db_host'),
  port: configService.get('db_port'),
  username: configService.get('db_user'),
  password: configService.get('db_password'),
  database: configService.get('db_name'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  ssl: {
    rejectUnauthorized: true
  },
  synchronize: true
});
