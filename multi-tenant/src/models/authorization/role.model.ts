import { BuildOptions, DataTypes, Model } from 'sequelize';
import { v4 } from 'uuid';

import { Database } from '@libs/database';

interface RoleAttributes {
  id?: string;
  name: string;
  createdAt?: Date;
  createdBy?: Date;
}

export interface RoleModel extends Model<RoleAttributes>, RoleAttributes { }

export class Role extends Model<RoleModel, RoleAttributes> implements RoleAttributes {
  id?: string;
  name: string;
  createdAt?: Date;
  createdBy?: Date;
}

export type RoleStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): RoleModel;
};

export function RoleFactory(schema: string): RoleStatic {
  return <RoleStatic>Database.get(schema).define('roles', {
    id: {
      type: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: v4()
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: 'Nome deve conter de 3 a 100 caracteres'
        },
        notNull: {
          msg: 'Nome não pode ser nulo'
        },
        notEmpty: {
          msg: 'Nome não pode ser vazio!'
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
