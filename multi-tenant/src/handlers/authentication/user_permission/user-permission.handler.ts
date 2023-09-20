import { API, Payload } from '@libs/handler.decorators';
import { APIEnum } from '@enuns/api.enum';
import { Transactional } from '@enuns/transactional.enum';
import { Auth } from '@enuns/auth.enum';
import { CrudHandler } from '@libs/handler.crud';
import { FeaturesEnum } from '@enuns/features.enum';
import { PermissionEnum } from '@enuns/permission.enum';
import { UserPermissionService } from '@services/authentication/user-permission/user-permission.service';

export class UserPermissionHandler extends CrudHandler {

  @API(`/user-permission/:id`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.USER_PERMISSION, PermissionEnum.VIEWER)
  public async get(payload: Payload) {
    return new UserPermissionService(payload).get(payload.id);
  }

  @API(`/user-permission`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.USER_PERMISSION, PermissionEnum.VIEWER)
  public async list(payload: Payload) {
    return new UserPermissionService(payload).list(payload.filter);
  }

  @API(`/user-permission`, APIEnum.POST, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.USER_PERMISSION, PermissionEnum.CREATED)
  public async create(payload: Payload) {
    return new UserPermissionService(payload).create(payload.body);
  }

  @API(`/user-permission/:id`, APIEnum.PUT, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.USER_PERMISSION, PermissionEnum.UPDATED)
  public async update(payload: Payload) {
    return new UserPermissionService(payload).update(payload.id, payload.body);
  }

  @API(`/user-permission/:id`, APIEnum.DELETE, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.USER_PERMISSION, PermissionEnum.DELETED)
  public async delete(payload: Payload) {
    return new UserPermissionService(payload).delete(payload.id);
  }

}