import { BuildOptions, DataTypes, Model } from 'sequelize';
import { v4 } from 'uuid';

import { Database } from '@libs/database';

interface RolePermissionAttributes {
  id?: string;
  name: string;
  roleId: string;
  feature: string;
  viewer: boolean;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  createdAt?: Date;
  createdBy?: Date;
}

export interface RolePermissionModel extends Model<RolePermissionAttributes>, RolePermissionAttributes { }

export class RolePermission extends Model<RolePermissionModel, RolePermissionAttributes> implements RolePermissionAttributes {
  id?: string;
  name: string;
  roleId: string;
  feature: string;
  viewer: boolean;
  created: boolean;
  updated: boolean;
  deleted: boolean;
  createdAt?: Date;
  createdBy?: Date;
}

export type RolePermissionStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): RolePermissionModel;
};

export function RolePermissionFactory(schema: string): RolePermissionStatic {
  return <RolePermissionStatic>Database.get(schema).define('role_permission', {
    id: {
      type: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: v4()
    },
    roleId: {
      field: 'role_id',
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
