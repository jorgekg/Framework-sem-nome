import axios from 'axios';

import { JWT } from '@libs/jwt';
import { Payload } from '@libs/handler.decorators';

import { ForbiddenException } from '@exceptions/forbidden.exception';
import { UserService } from '@services/authentication/user/user.service';

import { CredentialDto } from '@models/authorization/credential.dto';
import { AuthDto } from '@models/authorization/auth.dto';

export class AuthService {

  constructor(private payload: Payload) { }

  public async login(credential: CredentialDto) {
    credential.returnSecureToken = true;

    const userService = new UserService(this.payload);
    const user = await userService.getUserByEmail(credential.email);

    credential.email = user.email;

    try {
      await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=your-key', credential);

      return new AuthDto(new JWT().create(user, this.payload.schema), this.payload.schema);
    } catch (err) {
      if (err?.response?.data?.error?.message) {
        throw new ForbiddenException(err?.response?.data?.error?.message);
      } else {
        throw err;
      }
    }
  }

}