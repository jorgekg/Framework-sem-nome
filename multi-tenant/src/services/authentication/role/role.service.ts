import { Payload } from '@libs/handler.decorators';
import { CrudService } from '@libs/service.crud';
import { Role, RoleFactory } from '@models/authorization/role.model';

export class RoleService extends CrudService<Role> {

  constructor(payload: Payload) {
    super(payload, RoleFactory(payload.schema));
  }

}