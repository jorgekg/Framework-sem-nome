import { AuthHandler } from '@handlers/authentication/auth/auth.handler';
import { RolePermissionHandler } from '@handlers/authentication/role/role-permission.handler';
import { RoleHandler } from '@handlers/authentication/role/role.handler';
import { SchemaHandler } from '@handlers/authentication/schemas/schemas.handler';
import { UserPermissionHandler } from '@handlers/authentication/user_permission/user-permission.handler';
import { UserRoleHandler } from '@handlers/authentication/users/user-role.handler';
import { UserHandler } from '@handlers/authentication/users/user.handler';

export class Handlers {

    public static autoload() {
        new AuthHandler();
        new UserHandler();
        new SchemaHandler();
        new RoleHandler();
        new UserPermissionHandler();
        new RolePermissionHandler();
        new UserRoleHandler();
    }

}