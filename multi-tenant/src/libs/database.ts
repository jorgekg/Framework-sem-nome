import { Sequelize } from 'sequelize';
import pg from 'pg';

const env = 'development';
const config = require('../../config/config.json')[env];

export class Database {

  public static sequelize: any = {};

  public static get(schema = 'public'): Sequelize {
    if (!schema) {
      schema = 'public';
    }
    if (!Database.sequelize[schema]) {
      Database.initialize(schema);
    }
    return Database.sequelize[schema];
  }

  public static initialize(schema = 'public') {
    if (!schema) {
      schema = 'public';
    }
    console.log('database starting', schema);
    if (!Database.sequelize[schema] && schema) {
      try {
        console.log('database pool connection: ' + schema);
        Database.doInstance(schema);
      } catch (err) {
        console.log('Database connection error!');
        console.log(err);
      }
    }
  }

  private static doInstance(schema: string) {
    Database.sequelize[schema] = new Sequelize(
      process.env.DATABASE_NAME || config.database,
      process.env.DATABASE_USERNAME || config.username,
      process.env.DATABASE_PASSWORD || config.password,
      {
        host: process.env.DATABASE_HOST || config.host,
        dialect: 'postgres',
        dialectModule: pg,
        database: process.env.DATABASE_NAME || config.database,
        logging: !process.env.PRODUCTION,
        logQueryParameters: !process.env.PRODUCTION,
        schema: schema
      }
    );
  }
}
