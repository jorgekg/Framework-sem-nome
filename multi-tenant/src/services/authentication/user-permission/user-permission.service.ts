import { Payload } from '@libs/handler.decorators';
import { CrudService } from '@libs/service.crud';
import { UserPermission, UserPermissionFactory } from '@models/authorization/user-permission.model';
import { UserService } from '../user/user.service';

export class UserPermissionService extends CrudService<UserPermission> {

  constructor(payload: Payload) {
    super(payload, UserPermissionFactory(payload.schema));
  }

  protected async beforeCreate(entity: UserPermission): Promise<UserPermission> {
    await new UserService(this.payload).get(entity.userId);
    return entity;
  }

  protected async beforeUpdate(entity: UserPermission): Promise<UserPermission> {
    await new UserService(this.payload).get(entity.userId);
    return entity;
  }

}