import { Payload } from '@libs/handler.decorators';

export abstract class CrudHandler {

  public async validator(payload: Payload) {}

}