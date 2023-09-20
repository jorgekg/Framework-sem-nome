import * as pg from 'pg';
import Umzug from 'umzug';
import * as path from 'path';
import { DataTypes } from 'sequelize';

import { Database } from '@libs/database';

import { TenantDto } from '@models/authorization/tenant.dto';
import { BadRequestException } from '@exceptions/bad-request.exception';

import { Payload } from '@libs/handler.decorators';
import { UserService } from '../user/user.service';
import { SchemaFactory } from '@models/authorization/schema.model';
import { SchemaViewService } from './schema-view.service';
import { FeaturesEnum } from '@enuns/features.enum';
import { RoleFactory } from '@models/authorization/role.model';
import { RolePermissionFactory } from '@models/authorization/role-permission.model';

const env = process.env.NODE_ENV || 'development';
const config = require('../../../../config/config.json')[env];

export class SchemaService {

  public get(id: string) {
    return SchemaFactory('public').findByPk(id);
  }

  public async publicMigrate() {
    console.log('Migrando schema publico');
    await this.doMigrate('public', 'master');
    console.log('Atualizando views');
    await SchemaViewService.update();
  }

  public async tenantMigrate() {
    const tenants = await SchemaFactory('public').findAll({
      type: 'SELECT'
    });
    for (let tenant of tenants) {
      console.log(`Migrando schema ${tenant.name}`);
      await this.doMigrate(tenant.name, 'tenant');
      await this.updateAdminRole(tenant.name);
    }
  }

  public async updateAdminRole(schema: string) {
    const features = Object.keys(FeaturesEnum);
    console.log('Atualizando o papel admin');
    let adminRole = await RoleFactory(schema).findOne({
      where: {
        name: 'Administrador'
      }
    });
    if (!adminRole) {
      console.log('Papel admin criado!');
      adminRole = await RoleFactory(schema).create({
        name: 'Administrador'
      });
    }
    for (let feature of features) {
      await this.doUpdateRole(schema, adminRole.id, feature);
    }
  }

  private async doUpdateRole(schema: string, roleId: string, feature: string) {
    const permission = await RolePermissionFactory(schema).findOne({
      where: {
        feature: feature,
        roleId: roleId
      }
    });
    if (!permission) {
      console.log('Criando permissão para a feature', feature);
      
      await RolePermissionFactory(schema).create({
        roleId: roleId,
        feature: feature,
        viewer: true,
        created: true,
        updated: true,
        deleted: true
      });
    } else {
      console.log('Atualizando permissão para a feature', feature);
      await RolePermissionFactory(schema).update({
        roleId: roleId,
        feature: feature,
        viewer: true,
        created: true,
        updated: true,
        deleted: true
      }, {
        where: {
          id: permission.id
        }
      });
    }
  }

  public async createTenant(tenant: TenantDto, payload: Payload) {
    this.validateTenant(tenant);
    console.log('Criando um novo tenant');
    this.doMigrate(tenant.schema, 'tenant');
    console.log('Criando usuário padrão');
    try {
      payload.schema = tenant.schema;
      await SchemaFactory('public').create({
        name: payload.schema
      });
      payload.body.isAdmin = true;
      await (new UserService(payload).create(payload.body));
      console.log('Atualizando views');
      await SchemaViewService.update();
    } catch (err) {
      console.log(err);
      try {
        await (new UserService(payload).deleteByEmailFromFirebase(tenant.email));
        await this.dropSchema(payload.schema);
        await SchemaFactory('public').destroy({
          where: { name: payload.schema }
        });
      } catch (err) {
        throw err;
      }
      throw err;
    }
  }

  private async doMigrate(schema: string, folder: string) {
    console.log('Validando se o schema existe', schema);
    if (!(await this.validateSchema(schema))) {
      console.log('Criando um novo schema', schema);
      await this.createSchema(schema);
      console.log('schema criado', schema);
    }
    console.log('Iniciando a migração', schema);
    const database = Database.get(schema);

    const umzug = new Umzug({
      migrations: {
        path: path.join(__dirname, `/../../../migrations/${folder}`),
        params: [
          database?.getQueryInterface(),
          schema,
          DataTypes
        ]
      },
      logging: (log) => console.log(log),
      storage: 'sequelize',
      storageOptions: {
        sequelize: database,
        schema: schema
      }
    });
    await umzug.up();
    console.log('Migração finalizada');
  }

  private async createSchema(schema: string) {
    const pool = this.getPool();
    return new Promise((resolve, reject) => {
      pool.query(`CREATE SCHEMA ${schema};`, err => {
        pool.end();
        if (err) {
          reject(err);
        }
        resolve({});
      });
    });
  }

  private async dropSchema(schema: string) {
    const pool = this.getPool();
    return new Promise((resolve, reject) => {
      pool.query(`DROP SCHEMA ${schema} CASCADE`, err => {
        pool.end();
        if (err) {
          reject(err);
        }
        resolve({});
      });
    });
  }

  private async validateSchema(schema: string) {
    const pool = this.getPool()
    return new Promise((resolve, reject) => {
      pool.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${schema}';`, (err, data) => {
        pool.end();
        if (err) {
          reject(err);
        }
        resolve(!!data?.rows[0]?.schema_name);
      });
    });
  }

  private getPool() {
    return new pg.Pool({
      user: config.username,
      host: config.host,
      database: config.database,
      password: config.password,
    });
  }

  private validateTenant(tenant: TenantDto) {
    if (!tenant.schema) {
      throw new BadRequestException('Nome do schema é obrigatório');
    }
    if (!tenant.email) {
      throw new BadRequestException('Email é obrigatório');
    }
    if (!tenant.password) {
      throw new BadRequestException('Senha é obrigatório');
    }
    if (!tenant.name) {
      throw new BadRequestException('Nome do usuário obrigatório');
    }
  }
}