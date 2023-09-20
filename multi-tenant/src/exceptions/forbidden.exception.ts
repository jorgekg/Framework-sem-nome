export class ForbiddenException extends Error {

  public code: number;
  public translate: string;

  constructor(message: string, translate: string = null) {
    super(message);
    this.code = 403;
    this.translate = translate;
  }

}
