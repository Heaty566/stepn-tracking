import { monoEnum } from 'mono-utils-core';

export const config = {
    PORT: Number(process.env.PORT) || 4000,
    NODE_ENV: process.env.NODE_ENV || monoEnum.NODE_ENV_MODE.DEVELOPMENT,
    DEBUG: process.env.DEBUG || '',
    BASE_PRICE: process.env.BASE_PRICE || 2,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
};
