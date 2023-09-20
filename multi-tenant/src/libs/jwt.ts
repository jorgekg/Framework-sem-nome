// @ts-ignore: Unreachable code error
import Jwt from 'jsonwebtoken';
// @ts-ignore: Unreachable code error
import moment from 'moment';

import { ForbiddenException } from '@exceptions/forbidden.exception';

const config = require('../../config/config.json');

export class JWT {

  public create(data: any, schema: string) {
    delete data.createdAt;
    delete data.updatedAt;
    delete data.password;
    delete data.biography;
    
    return Jwt.sign({
      ...data,
      schema
    }, process.env.JWT_SECURITY || config.jwtSecurity, { expiresIn: '20h' });
  }

  public decode<T>(token: string, ignoreExpiration = false) {
    try {
      return Jwt.verify(token, process.env.JWT_SECURITY || config.jwtSecurity, { ignoreExpiration: ignoreExpiration }) as T;
    } catch (err) {
      console.log(err);

      throw new ForbiddenException('Your token is not valid!')
    }
  }

}