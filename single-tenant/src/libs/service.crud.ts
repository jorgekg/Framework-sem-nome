// @ts-ignore: Unreachable code error
const parseOData = require('odata-sequelize');
// @ts-ignore: Unreachable code error
import { v4 } from 'uuid';

import { Model, Op } from 'sequelize';

import { Payload } from '@libs/handler.decorators';
import { NotFoundException } from '@exceptions/not-found.exception';
import { Database } from './database';


export abstract class CrudService<T extends Model> {

  constructor(
    protected payload: Payload,
    protected entity: any
  ) { }

  public async get(id: string, callbacks = true): Promise<T> {
    let entity = await this.entity.findByPk(id, {
      transaction: this.payload.transaction,
      lock: false
    });
    if (!entity) {
      throw new NotFoundException(`Id ${id} não foi encontrado!`);
    }
    if (entity.dataValues) {
      entity = entity.dataValues;
    }
    if (callbacks) {
      const newEntity = await this.afterGet(entity);
      if (newEntity) {
        entity = newEntity;
      }
    }
    return entity;
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.findAll();
  }

  public async list(filter: iFilter) {
    if (filter.size) {
      filter.top = filter.size > 500 ? 500 : filter.size;
      delete filter.size;
    } else {
      filter.top = 10;
    }
    if (!filter.page) {
      filter.skip = 0;
    } else {
      filter.skip = ((filter.page - 1) * filter.top);
      delete filter.page;
    }
    const filterStr = Object.keys(filter).map(key => '$' + key + '=' + (filter as any)[key]).join('&');
    const query = parseOData(filterStr, Database.get(this.payload.schema)) as any;
    if (query && query.where) {
      const andsQuery = query.where[Op.and];
      if (andsQuery) {
        andsQuery.forEach(andQuery => {
          const keys = Object.keys(andQuery);
          if (keys) {
            keys.forEach(k => {
              const filterQuery = andQuery[k][Op.like];
              if (filterQuery) {
                delete andQuery[k][Op.like];
                andQuery[k][Op.iLike] = filterQuery;
              }
              if (andQuery[k][Op.ne] && andQuery[k][Op.ne].toString().includes('null')) {
                delete andQuery[k][Op.ne];
                andQuery[k][Op.not] = null;
              }
              if (andQuery[k][Op.eq] && andQuery[k][Op.eq].toString().includes('null')) {
                delete andQuery[k][Op.eq];
                andQuery[k][Op.is] = null;
              }
            });
          }
        });
      } else {
        const keys = Object.keys(query.where);
        if (keys) {
          keys.forEach(k => {
            const filterQuery = query.where[k][Op.like];
            if (filterQuery) {
              delete query.where[k][Op.like];
              query.where[k][Op.iLike] = filterQuery;
            }
            if (query.where[k][Op.ne] && query.where[k][Op.ne].toString().includes('null')) {
              delete query.where[k][Op.ne];
              query.where[k][Op.not] = null;
            }
            if (query.where[k][Op.eq] && query.where[k][Op.eq].toString().includes('null')) {
              delete query.where[k][Op.eq];
              query.where[k][Op.is] = null;
            }
          });
        }
      }
    }

    if (!query.where) {
      query.where = {};
    }
    const data = await this.entity.findAndCountAll(query);

    return {
      totalElements: data.count,
      totalPages: parseInt(((data.count / filter.top) + 1).toString()),
      contents: this.afterList ? await this.afterList(data.rows?.map(r => r.dataValues)) : data.rows?.map(r => r.dataValues) as T[]
    };
  }

  public async createMaster(entity: T) {
    await this.entity.create(entity, {
      transaction: this.payload.transaction
    });
  }

  public async  create(entity: T) {
    let entitySaved = null;
    entity = await this.beforeCreate(entity);
    (entity as any).id = v4();
    (entity as any).createdBy = this.payload.session?.email || 'System';
    (entity as any).updatedBy = this.payload.session?.email || 'System';
    entitySaved = await this.entity.create(entity, {
      transaction: this.payload.transaction
    });
    if (entitySaved && entitySaved.dataValues) {
      entitySaved = entitySaved.dataValues;
    }
    entitySaved = await this.afterCreate(entity, entitySaved);
    return entitySaved;
  }

  public async update(id: string, entity: T) {
    const oldEntity = await this.get(id);
    let entityUpdated = entity;
    (entity as any).updatedBy = this.payload.session?.email || 'System';
    entity = await this.beforeUpdate(entity);
    await this.entity.update(entity, {
      where: {
        id: id
      },
      transaction: this.payload.transaction
    });
    entityUpdated = await this.afterUpdate(oldEntity, entityUpdated);

    Object.keys(entityUpdated).forEach(key => {
      if ((entityUpdated as any)[key]) {
        (oldEntity as any)[key] = (entityUpdated as any)[key];
      }
    });
    if ((entityUpdated as any).urlUpload) {
      (oldEntity as any)['dataValues']['urlUpload'] = (entityUpdated as any).urlUpload;
    }
    return oldEntity;
  }

  public async delete(id: string) {
    await this.get(id);
    await this.beforeDelete(id);
    await this.entity.destroy({
      where: {
        id: id
      },
      transaction: this.payload.transaction
    });
    await this.afterDelete(id);
  }

  public async getSubEntityEager(service: CrudService<any>, inFields: (string | undefined)[]): Promise<any[]> {
    return (await service.entity.findAll({
      where: {
        id: {
          [Op.in]: inFields
        }
      },
      transaction: this.payload.transaction
    }))?.map(data => data.dataValues);
  }

  public async getEagerBySubEntity(service: CrudService<any>, field: string, id: string): Promise<any[]> {
    const where = {} as any;
    where[field] = id;
    return (await service.entity.findAll({
      where: where,
      transaction: this.payload.transaction
    }))?.map(data => data.dataValues);
  }

  public async getEagerByIds(field: string, ids: string[]): Promise<any[]> {
    const where = {} as any;
    where[field] = {
      [Op.in]: ids
    };
    return (await this.entity.findAll({
      where: where,
      transaction: this.payload.transaction
    }))?.map(data => data.dataValues);
  }

  public async getAll(field: string, id: string): Promise<T[]> {
    const where = {} as any;
    where[field] = id;
    return (await this.entity.findAll({
      where: where,
      transaction: this.payload.transaction
    }))?.map(data => data.dataValues);
  }

  public async exists(field: string, id: string): Promise<boolean> {
    const where = {} as any;
    where[field] = id;
    const item = (await this.entity.findOne({
      where: where,
      transaction: this.payload.transaction,
    }));
    return item != null;
  }

  public async getAllData(): Promise<T[]> {
    return (await this.entity.findAll({
      transaction: this.payload.transaction
    }))?.map(data => data.dataValues);
  }

  public async deleteAllBy(field: string, id: string) {
    const where = {} as any;
    where[field] = id;
    return this.entity.destroy({
      where: where,
      transaction: this.payload.transaction
    });
  }

  protected async afterGet(entity: T): Promise<T> {
    return entity;
  }

  protected async afterList(entities: T[]): Promise<T[]> {
    return entities;
  }

  protected async beforeCreate(entity: T): Promise<T> {
    return entity;
  }

  protected async afterCreate(_: T, entitySaved: T): Promise<T> {
    return entitySaved;
  }

  protected async beforeUpdate(entity: T): Promise<T> {
    return entity;
  }

  protected async afterUpdate(_: T, entitySaved: T): Promise<T> {
    return entitySaved;
  }

  protected async beforeDelete(id: string): Promise<void> {

  }

  protected async afterDelete(id: string): Promise<void> {

  }
}

export interface iFilter {
  size?: number;
  top?: number;
  skip?: number;
  page?: number;
  filter?: string;
}
