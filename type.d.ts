import { User as UserExtend } from './src/core/models';

declare global {
    namespace Express {
        interface User extends UserExtend {}
    }
}
