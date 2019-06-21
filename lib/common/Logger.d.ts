import * as winston from 'winston';
export default class Logger {
    logger: winston.Logger;
    level: string;
    constructor(level?: string);
    write(): winston.Logger;
}
