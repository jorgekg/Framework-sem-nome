import { API, Payload } from '@libs/handler.decorators';

import { UserService } from '@services/authentication/user/user.service';

import { APIEnum } from '@enuns/api.enum';
import { Transactional } from '@enuns/transactional.enum';
import { Auth } from '@enuns/auth.enum';
import { CrudHandler } from '@libs/handler.crud';
import { FeaturesEnum } from '@enuns/features.enum';
import { PermissionEnum } from '@enuns/permission.enum';

export class UserHandler extends CrudHandler {

  @API(`/user-active`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.USER, PermissionEnum.VIEWER)
  public active(payload: Payload) {
    return payload.session;
  }

  @API(`/user/:id`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.USER, PermissionEnum.VIEWER)
  public async get(payload: Payload) {
    return new UserService(payload).get(payload.id);
  }

  @API(`/user`, APIEnum.GET, Transactional.READ_ONLY, Auth.REQUIRED, FeaturesEnum.USER, PermissionEnum.VIEWER)
  public async list(payload: Payload) {
    return new UserService(payload).list(payload.filter);
  }

  @API(`/user/admin`, APIEnum.POST, Transactional.TRANSACTION, Auth.NO_AUTH)
  public async createUserAdmin(payload: Payload) {
    return new UserService(payload).createAdminUser();
  }

  @API(`/user`, APIEnum.POST, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.USER, PermissionEnum.CREATED)
  public async create(payload: Payload) {
    return new UserService(payload).create(payload.body);
  }

  @API('/user/reset-password', APIEnum.POST, Transactional.TRANSACTION, Auth.NO_AUTH)
  public async resetPassword(payload: Payload) {
    return new UserService(payload).resetPassword(payload.body.email);
  }

  @API(`/user/:id`, APIEnum.PUT, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.USER, PermissionEnum.UPDATED)
  public async update(payload: Payload) {
    return new UserService(payload).update(payload.id, payload.body);
  }

  @API(`/user/:id`, APIEnum.DELETE, Transactional.TRANSACTION, Auth.REQUIRED, FeaturesEnum.USER, PermissionEnum.DELETED)
  public async delete(payload: Payload) {
    return new UserService(payload).delete(payload.id);
  }

}