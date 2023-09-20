const { QueryTypes } = require('sequelize');

import { Payload } from '@libs/handler.decorators';
import { CrudService } from '@libs/service.crud';
import { RoleService } from './role.service';
import { UserRole, UserRoleFactory } from '@models/authorization/user-roles.model';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@exceptions/bad-request.exception';
import { Database } from '@libs/database';
import { UserPermissionService } from '../user-permission/user-permission.service';

export class UserRoleService extends CrudService<UserRole> {

  constructor(payload: Payload) {
    super(payload, UserRoleFactory(payload.schema));
  }

  public getByUser(userId: string) {
    return this.getAll('userId', userId);
  }

  protected async beforeCreate(entity: UserRole): Promise<UserRole> {
    await new RoleService(this.payload).get(entity.roleId);
    await new UserService(this.payload).get(entity.userId);
    return entity;
  }

  protected async afterCreate(_: UserRole, entitySaved: UserRole): Promise<UserRole> {
    await this.updateRoles(entitySaved.userId);
    return entitySaved;
  }

  protected async beforeUpdate(_: UserRole): Promise<UserRole> {
    throw new BadRequestException('Não é possível atualizar!');
  }

  protected async beforeDelete(id: string): Promise<void> {
    const entity = await this.get(id);
    await this.updateRoles(entity.userId);
  }

  private async updateRoles(userId: string) {
    const rolesOnUser = await this.getByUser(userId);
    const roleIds = rolesOnUser.map(r => r.roleId);
    const features = await Database.get(this.payload.schema).query(
      `select 
      feature, 
        exists(select viewer from "${this.payload.schema}".role_permission rp2 where rp2.role_id in (?) and rp2.viewer = true and rp2.feature = rp.feature) as viewer,
        exists(select created from "${this.payload.schema}".role_permission rp2 where rp2.role_id in (?) and rp2.created = true and rp2.feature = rp.feature) as created,
        exists(select updated from "${this.payload.schema}".role_permission rp2 where rp2.role_id in (?) and rp2.updated = true and rp2.feature = rp.feature) as updated,
        exists(select deleted from "${this.payload.schema}".role_permission rp2 where rp2.role_id in (?) and rp2.deleted = true and rp2.feature = rp.feature) as deleted
      from "${this.payload.schema}".role_permission rp 
      where role_id in (?)
      group by feature, 2, 3, 4, 5`,
      {
        replacements: [roleIds, roleIds, roleIds, roleIds, roleIds],
        type: QueryTypes.SELECT
      }
    ) as any[];
    await Database.get(this.payload.schema).query(`delete from "${this.payload.schema}".user_permission where user_id = ?`, {
      replacements: [userId]
    });
    for (const feature of features) {
      await new UserPermissionService(this.payload).create({
        userId: userId,
        feature: feature.feature,
        viewer: feature.viewer,
        created: feature.created,
        updated: feature.updated,
        deleted: feature.deleted
      } as any);
    }
  }
}