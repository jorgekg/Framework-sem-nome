import { API, Payload } from '@libs/handler.decorators';
import { APIEnum } from '@enuns/api.enum';
import { Transactional } from '@enuns/transactional.enum';
import { Auth } from '@enuns/auth.enum';
import { CrudHandler } from '@libs/handler.crud';
import { FeaturesEnum } from '@enuns/features.enum';
import { PermissionEnum } from '@enuns/permission.enum';
import { RolePermissionService } from '@services/authentication/role/role-permission.service';

export class RolePermissionHandler extends CrudHandler {

  @API(`/role-permission/:id`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.VIEWER)
  public async get(payload: Payload) {
    return new RolePermissionService(payload).get(payload.id);
  }

  @API(`/role-permission`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.VIEWER)
  public async list(payload: Payload) {
    return new RolePermissionService(payload).list(payload.filter);
  }

  @API(`/role-permission`, APIEnum.POST, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.CREATED)
  public async create(payload: Payload) {
    return new RolePermissionService(payload).create(payload.body);
  }

  @API(`/role-permission/:id`, APIEnum.PUT, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.UPDATED)
  public async update(payload: Payload) {
    return new RolePermissionService(payload).update(payload.id, payload.body);
  }

  @API(`/role-permission/:id`, APIEnum.DELETE, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE_PERMISSION, PermissionEnum.DELETED)
  public async delete(payload: Payload) {
    return new RolePermissionService(payload).delete(payload.id);
  }

}