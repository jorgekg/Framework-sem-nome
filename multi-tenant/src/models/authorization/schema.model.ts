import { BuildOptions, DataTypes, Model } from 'sequelize';
import { v4 } from 'uuid';

import { Database } from '@libs/database';

interface SchemaAttributes {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: string;
}

export interface SchemaModel extends Model<SchemaAttributes>, SchemaAttributes { }

export class Schema extends Model<SchemaModel, SchemaAttributes> implements SchemaAttributes {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: string;
}

export type SchemaStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): SchemaModel;
};

export function SchemaFactory(schema: string): SchemaStatic {
  return <SchemaStatic>Database.get(schema).define('schemas', {
    id: {
      type: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: v4()
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: 'O nome deve conter de 2 a 255 caracteres'
        },
        notNull: {
          msg: 'Nome é obrigatório!'
        },
        notEmpty: {
          msg: 'Nome é obrigatório!'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: true
  });
}
