import { AuthHandler } from '@handlers/authentication/auth/auth.handler';
import { UserHandler } from '@handlers/authentication/users/user.handler';

export class Handlers {

    public static autoload() {
        new AuthHandler();
        new UserHandler();
    }

}