// @ts-ignore: Unreachable code error
import express from 'express';

export class ContextInstance {
  
  public static EXPRESS: express;

  public static get() {
    return ContextInstance.EXPRESS;
  }

}