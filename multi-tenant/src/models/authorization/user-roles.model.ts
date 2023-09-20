import { BuildOptions, DataTypes, Model } from 'sequelize';
import { v4 } from 'uuid';

import { Database } from '@libs/database';

interface UserRoleAttributes {
  id?: string;
  roleId: string;
  userId: string;
  createdAt?: Date;
  createdBy?: Date;
}

export interface UserRoleModel extends Model<UserRoleAttributes>, UserRoleAttributes { }

export class UserRole extends Model<UserRoleModel, UserRoleAttributes> implements UserRoleAttributes {
  id?: string;
  roleId: string;
  userId: string;
  createdAt?: Date;
  createdBy?: Date;
}

export type UserRoleStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserRoleModel;
};

export function UserRoleFactory(schema: string): UserRoleStatic {
  return <UserRoleStatic>Database.get(schema).define('user_roles', {
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
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: false
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
