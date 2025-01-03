/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import path = require('path');

const dataSource =  new DataSource({
     type: 'mysql',
     host: process.env.DATABASE_HOST || 'localhost',
     port: 3306,
     username: process.env.DATABASE_USERNAME || 'root',
     password: process.env.DATABASE_PASSWORD || '',
     database: process.env.DATABASE_NAME || 'biolerplat',
     entities: [path.join(__dirname, '../**', '*.entity.{ts,js}')],
     migrations: [path.join(__dirname, '../**', '*.migration.{ts,js}')],
     synchronize: false,
     migrationsRun: true,
     timezone: 'Z',
     extra: {
          ssl: false
     },
});

export default dataSource;