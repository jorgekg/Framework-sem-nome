// @ts-ignore: Unreachable code error
import express from 'express';
import { Request, Response } from 'express';

import { Interceptor } from '@libs/interceptor';
import { ExpressInstance } from '@libs/express';
import { Database } from '@libs/database';

import { ForbiddenException } from '@exceptions/forbidden.exception';

import { APIEnum } from '@enuns/api.enum';
import { Auth } from '@enuns/auth.enum';
import { Transactional } from '@enuns/transactional.enum';
import { FeaturesEnum } from '@enuns/features.enum';
import { CrudHandler } from './handler.crud';
import { JWT } from './jwt';
import { User } from '@models/authorization/user.model';
import { UnauthorizedException } from '@exceptions/unauthorized.exception';
import { Transaction } from 'sequelize';
import { UserPermissionService } from '@services/authentication/user-permission/user-permission.service';
import { PermissionEnum } from '@enuns/permission.enum';

export const API =
  // eslint-disable-next-line max-len
  (endpoint: string, type: APIEnum, transactional = Transactional.TRANSACTION, auth = Auth.REQUIRED,
    feature: FeaturesEnum = null, permissionLevel: PermissionEnum = null) =>
    (className: any, _2: string, propDesc: PropertyDescriptor) => {
      if (!ExpressInstance.EXPRESS) {
        ExpressInstance.EXPRESS = express();
      }
      switch (type) {
        case APIEnum.POST:
          ExpressInstance.get().post(endpoint, async (req: Request, res: Response) =>
            res.send(await processRequest(className, propDesc.value, req, res, transactional, auth, feature, permissionLevel))
          );
          break;
        case APIEnum.PUT:
          ExpressInstance.get().put(endpoint, async (req: Request, res: Response) =>
            res.send(await processRequest(className, propDesc.value, req, res, transactional, auth, feature, permissionLevel))
          );
          break;
        case APIEnum.DELETE:
          ExpressInstance.get().delete(endpoint, async (req: Request, res: Response) =>
            res.send(await processRequest(className, propDesc.value, req, res, transactional, auth, feature, permissionLevel))
          );
          break;
        case APIEnum.GET:
        default:
          ExpressInstance.get().get(endpoint, async (req: Request, res: Response) =>
            res.send(await processRequest(className, propDesc.value, req, res, transactional, auth, feature, permissionLevel))
          );
          break;
      }
    };

const processRequest = async (instance: CrudHandler, method: Function, req: Request, res: Response, transactional = Transactional.TRANSACTION, auth = Auth.REQUIRED,
  feature: FeaturesEnum, permissionLevel: PermissionEnum = null) => {
  if (req.body && req.body.toString()) {
    req.body = JSON.parse(req.body);
  }
  const payload = new Payload(req.params.id, req.body, req.query, req.headers['x-tenant']?.toString(), req, res);
  try {
    if (auth === Auth.REQUIRED && !req.headers['x-api-key']) {
      throw new ForbiddenException('Não autenticado!');
    }
    if (req.headers['x-api-key']) {
      payload.session = new JWT().decode<User>(req.headers['x-api-key'].toString());
      Database.initialize();
      if (feature) {
        const permission = await new UserPermissionService(payload).getRoleByUser(payload.session.id, feature);
        if ((!permission || !permission[permissionLevel]) && !payload.session?.isAdmin) {
          throw new UnauthorizedException('Seu usuário não tem permissão para realizar esta operação!');
        }
      }
    } else {
      payload.schema = 'public';
      Database.initialize('public');
    }
    if (transactional === Transactional.TRANSACTION) {
      payload.transaction = await Database.get().transaction();
    }
    const response = await method(payload);
    if (transactional === Transactional.TRANSACTION) {
      await payload.transaction.commit();
    }
    return response;
  } catch (err) {
    console.error(err);

    if (transactional === Transactional.TRANSACTION && payload.transaction) {
      await payload.transaction.rollback();
    }
    Interceptor.map(res, err);
  }
};

export class Payload {
  constructor(
    public id: string,
    public body: any,
    public filter: any,
    public schema: string,
    public request: Request,
    public response: Response,
    public session?: User,
    public transaction?: Transaction
  ) { }

  public static instance() {
    return new Payload(null, null, null, null, null, null);
  }
}
