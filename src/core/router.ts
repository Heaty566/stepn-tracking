import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { config } from './config';
import { monoEnum, monoLogger } from 'mono-utils-core';
import helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { constant } from '.';

export function router(app: INestApplication) {
    app.use(cookieParser());
    app.setGlobalPrefix('/api');

    if (config.NODE_ENV === monoEnum.NODE_ENV_MODE.PRODUCTION) {
        app.use(helmet());
        app.use(compression());
    }
    app.use(
        morgan('dev', {
            stream: { write: (msg) => monoLogger.log(constant.NS.HTTP, msg) },
        }),
    );
}
