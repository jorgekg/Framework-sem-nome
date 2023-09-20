import { Payload } from '@libs/handler.decorators';
import { CrudService } from '@libs/service.crud';
import { RolePermission, RolePermissionFactory } from '@models/authorization/role-permission.model';
import { RoleService } from './role.service';

export class RolePermissionService extends CrudService<RolePermission> {

  constructor(payload: Payload) {
    super(payload, RolePermissionFactory(payload.schema));
  }

  protected async beforeCreate(entity: RolePermission): Promise<RolePermission> {
    await new RoleService(this.payload).get(entity.roleId);
    return entity;
  }

  protected async beforeUpdate(entity: RolePermission): Promise<RolePermission> {
    await new RoleService(this.payload).get(entity.roleId);
    return entity;
  }

}