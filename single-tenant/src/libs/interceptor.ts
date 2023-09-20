import * as express from 'express';
// import { ConnectionError, ForeignKeyConstraintError } from 'sequelize';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ConflictedException } from '../exceptions/conflicted.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { BadRequestException } from '../exceptions/bad-request.exception';

export class Interceptor {

  public static map(response: express.Response, error: any) {
    const resp = {
      code: 500,
      message: 'Ocorreu um erro inesperado!',
      translate: null
    };
    if (error && error.errors && error.errors.length) {
      resp.code = 400;
      resp.message = error.errors.map((err: any) => err.message).join(', ');
    }
    if (error instanceof BadRequestException) {
      resp.code = 400;
      resp.message = error.message;
      resp.translate = error.translate;
    }
    if (error instanceof NotFoundException) {
      resp.code = 404;
      resp.message = error.message;
    }
    if (error instanceof ForbiddenException) {
      resp.code = 403;
      resp.message = error.message;
      resp.translate = error.translate;
    }
    if (error instanceof ConflictedException) {
      resp.code = 409;
      resp.message = error.message;
      resp.translate = error.translate;
    }
    if (error instanceof UnauthorizedException) {
      resp.code = 401;
      resp.message = error.message;
    }
    // if (error instanceof ConnectionError) {
    //   resp.code = 400;
    //   resp.message = 'Não foi possível encontrar o tenant informado!';
    // }
    // if (error instanceof ForeignKeyConstraintError) {
    //   resp.code = 404;
    //   resp.message = 'Verifique os IDs informados e tente novamente';
    // }
    if (error instanceof Error && error.message.includes('auth/id-token-expired')) {
      resp.code = 401;
      resp.message = error.message;
    }
    if (resp.code === 500) {
      console.error(error);
    }
    response.status(resp.code).send(resp);
  }

}
