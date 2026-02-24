import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/modules/user/entities/user.entity';
import { Group } from './src/modules/group/entities/group.entity';
import { Membership } from './src/modules/membership/entities/membership.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'fitconnect_community',
  schema: 'community',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, Group, Membership],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
