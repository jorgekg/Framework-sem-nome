import { API, Payload } from '@libs/handler.decorators';
import { APIEnum } from '@enuns/api.enum';
import { Transactional } from '@enuns/transactional.enum';
import { Auth } from '@enuns/auth.enum';
import { CrudHandler } from '@libs/handler.crud';
import { FeaturesEnum } from '@enuns/features.enum';
import { PermissionEnum } from '@enuns/permission.enum';
import { RoleService } from '@services/authentication/role/role.service';

export class RoleHandler extends CrudHandler {

  @API(`/role/:id`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.ROLE, PermissionEnum.VIEWER)
  public async get(payload: Payload) {
    return new RoleService(payload).get(payload.id);
  }

  @API(`/role`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.ROLE, PermissionEnum.VIEWER)
  public async list(payload: Payload) {
    return new RoleService(payload).list(payload.filter);
  }

  @API(`/role`, APIEnum.POST, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE, PermissionEnum.CREATED)
  public async create(payload: Payload) {
    return new RoleService(payload).create(payload.body);
  }

  @API(`/role/:id`, APIEnum.PUT, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE, PermissionEnum.UPDATED)
  public async update(payload: Payload) {
    return new RoleService(payload).update(payload.id, payload.body);
  }

  @API(`/role/:id`, APIEnum.DELETE, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.ROLE, PermissionEnum.DELETED)
  public async delete(payload: Payload) {
    return new RoleService(payload).delete(payload.id);
  }

}