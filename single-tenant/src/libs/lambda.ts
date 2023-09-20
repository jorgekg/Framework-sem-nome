import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'

export const middyfy = (handler) => {
  console.log(handler);
  
  const ret = middy(handler).use(middyJsonBodyParser())
  return ret;
  
}
