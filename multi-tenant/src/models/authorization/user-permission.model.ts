import { BuildOptions, DataTypes, Model } from 'sequelize';
import { v4 } from 'uuid';

import { Database } from '@libs/database';

interface UserPermissionAttributes {
  id?: string;
  userId: string;
  feature: string;
  viewer: boolean;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  createdAt?: Date;
  createdBy?: Date;
}

export interface UserPermissionModel extends Model<UserPermissionAttributes>, UserPermissionAttributes { }

export class UserPermission extends Model<UserPermissionModel, UserPermissionAttributes> implements UserPermissionAttributes {
  id?: string;
  userId: string;
  feature: string;
  viewer: boolean;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  createdAt?: Date;
  createdBy?: Date;
}

export type UserPermissionStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserPermissionModel;
};

export function UserPermissionFactory(schema: string): UserPermissionStatic {
  return <UserPermissionStatic>Database.get(schema).define('user_permission', {
    id: {
      type: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: v4()
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: false
    },
    feature: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: 'Nome deve conter de 3 a 50 caracteres'
        },
        notNull: {
          msg: 'Nome não pode ser nulo'
        },
        notEmpty: {
          msg: 'Nome não pode ser vazio!'
        }
      }
    },
    viewer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    updated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
