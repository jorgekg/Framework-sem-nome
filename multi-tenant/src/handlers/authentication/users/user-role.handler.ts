import { API, Payload } from '@libs/handler.decorators';
import { APIEnum } from '@enuns/api.enum';
import { Transactional } from '@enuns/transactional.enum';
import { Auth } from '@enuns/auth.enum';
import { CrudHandler } from '@libs/handler.crud';
import { FeaturesEnum } from '@enuns/features.enum';
import { PermissionEnum } from '@enuns/permission.enum';
import { UserRoleService } from '@services/authentication/role/user-role.service';

export class UserRoleHandler extends CrudHandler {

  @API(`/user-role/:id`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.VIEWER)
  public async get(payload: Payload) {
    return new UserRoleService(payload).get(payload.id);
  }

  @API(`/user-role`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.VIEWER)
  public async list(payload: Payload) {
    return new UserRoleService(payload).list(payload.filter);
  }

  @API(`/user-role`, APIEnum.POST, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.CREATED)
  public async create(payload: Payload) {
    return new UserRoleService(payload).create(payload.body);
  }

  @API(`/user-role/:id`, APIEnum.PUT, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.UPDATED)
  public async update(payload: Payload) {
    return new UserRoleService(payload).update(payload.id, payload.body);
  }

  @API(`/user-role/:id`, APIEnum.DELETE, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.DELETED)
  public async delete(payload: Payload) {
    return new UserRoleService(payload).delete(payload.id);
  }

}