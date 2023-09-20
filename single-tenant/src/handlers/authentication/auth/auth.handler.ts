import { API, Payload } from "@libs/handler.decorators";

import { AuthService } from "@services/authentication/auth/auth.service";

import { APIEnum } from "@enuns/api.enum";
import { Auth } from "@enuns/auth.enum";
import { Transactional } from "@enuns/transactional.enum";

export class AuthHandler {

  @API(`/login`, APIEnum.POST, Transactional.READ_ONLY, Auth.NO_AUTH)
  public async login(payload: Payload) {
    return new AuthService(payload).login(payload.body);
  }

}