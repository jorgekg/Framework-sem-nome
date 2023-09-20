import { BuildOptions, DataTypes, Model } from 'sequelize';
import { v4 } from 'uuid';

import { Database } from '@libs/database';

interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  isAdmin: boolean;
  permission?: any[];
  createdAt?: Date;
  updatedAt?: string;
  createdBy?: Date;
  updatedBy?: string;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes { }

export class User extends Model<UserModel, UserAttributes> implements UserAttributes {
  id?: string;
  name: string;
  email: string;
  isAdmin: boolean;
  permission?: any[];
  createdAt?: Date;
  updatedAt?: string;
  createdBy?: Date;
  updatedBy?: string;
}

export type UserStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(): UserStatic {
  return <UserStatic>Database.get('public').define('user', {
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
          msg: 'The name must contain 3 to 100 characters'
        },
        notNull: {
          msg: 'The name cannot be null!'
        },
        notEmpty: {
          msg: 'The name cannot be null!'
        }
      }
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        len: {
          args: [3, 250],
          msg: 'The e-mail must contain 3 to 250 characters'
        },
        notNull: {
          msg: 'The e-mail cannot be null!'
        },
        notEmpty: {
          msg: 'The e-mail cannot be null!'
        }
      }
    },
    isAdmin: {
      field: 'is_admin',
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
