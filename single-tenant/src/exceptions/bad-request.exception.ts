export class BadRequestException extends Error {

  public code: number;
  public translate: string;

  constructor(message: string, translate: string = null) {
    super(message);
    this.code = 400;
    this.translate = translate;
  }

}
