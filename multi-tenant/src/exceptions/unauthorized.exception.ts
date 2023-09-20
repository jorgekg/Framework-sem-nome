export class UnauthorizedException extends Error {

  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 401;
  }

}
