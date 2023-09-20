// @ts-ignore: Unreachable code error
import express from 'express';

export class ExpressInstance {
  
  public static EXPRESS: express;

  public static get() {
    return ExpressInstance.EXPRESS;
  }

}