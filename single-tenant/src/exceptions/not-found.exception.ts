export class NotFoundException extends Error {

  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 404;
  }

}
