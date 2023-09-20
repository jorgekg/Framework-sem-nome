import { API, Payload } from "@libs/handler.decorators";

import { APIEnum } from "@enuns/api.enum";
import { Auth } from "@enuns/auth.enum";
import { Transactional } from "@enuns/transactional.enum";
import { SchemaService } from "@services/authentication/schema/schema.service";
import { UserService } from "@services/authentication/user/user.service";
import { ForbiddenException } from "@exceptions/forbidden.exception";

export class SchemaHandler {

  @API(`/public-create-admin-user`, APIEnum.POST, Transactional.TRANSACTION, Auth.NO_AUTH)
  public async publicCreateAdminUserg(payload: Payload) {
    const user = await new UserService(payload).getAllData();
    if (user.length && user.some(u => u.email === 'admin@admin.com')) {
      throw new ForbiddenException('Já existe um usuário admin!');
    }
    try {
      await new UserService(payload).createMaster({
        email: 'admin@admin.com',
        name: 'admin',
        isAdmin: true
      } as any);
    } catch(err) {}

    await new UserService(payload).createAdminUser();
    
    return {
      email: 'admin@admin.com',
      password: 'sad54f%2z'
    };
  }

  @API(`/public-migrate`, APIEnum.POST, Transactional.TRANSACTION, Auth.NO_AUTH)
  public async publicMigate(_: Payload) {
    return new SchemaService().publicMigrate();
  }

  @API(`/tenant-migrate`, APIEnum.POST, Transactional.TRANSACTION, Auth.NO_AUTH)
  public async tenantMigate(_: Payload) {
    return new SchemaService().tenantMigrate();
  }

  @API(`/create-tenant`, APIEnum.POST, Transactional.TRANSACTION, Auth.NO_AUTH)
  public async createMigate(payload: Payload) {
    return new SchemaService().createTenant(payload.body, payload);
  }
}