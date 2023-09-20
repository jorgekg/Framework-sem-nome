export class ConflictedException extends Error {

  public code: number;
  public translate: string;

  constructor(message: string, translate: string = null) {
    super(message);
    this.code = 409;
    this.translate = translate;
  }

}
