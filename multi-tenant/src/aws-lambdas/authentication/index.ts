import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/authentication.main`,
  events: [
    {
      http: {
        method: 'any',
        path: '/authentication-api/{proxy+}',
        cors: {
          origin: '*',
          headers: ['*']
        }
      }
    },
    {
      http: {
        method: 'any',
        path: '/authentication-api/',
        cors: {
          origin: '*',
          headers: ['*']
        }
      }
    }
  ]
}
