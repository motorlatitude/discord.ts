// NPM Module
import * as winston from 'winston';
const { combine, timestamp, label, printf } = winston.format;

export default class Logger {
  public logger: winston.Logger;

  public level: string = 'verbose';

  constructor(level?: string) {
    this.level = level ? level : 'verbose';

    const myFormat = printf((options: any) => {
      if (options.message instanceof Error) {
        return (
          '[' +
          options.level +
          (options.level === 'info' || options.level === 'warn' ? ' ' : '') +
          '][' +
          options.timestamp +
          '] service.' +
          (options.service ? options.service : 'discord.ts') +
          ': ' +
          options.message.stack +
          (options.details ? '\nAttached Details: ' + JSON.stringify(options.details, null, '\t') : '')
        );
      } else {
        return (
          '[' +
          options.level +
          (options.level === 'info' || options.level === 'warn' ? ' ' : '') +
          '][' +
          options.timestamp +
          '] service.' +
          (options.service ? options.service : 'discord.ts') +
          ': ' +
          options.message +
          (options.details ? '\nAttached Details: ' + JSON.stringify(options.details, null, '\t') : '')
        );
      }
    });

    this.logger = winston.createLogger({
      format: winston.format.combine(timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), myFormat),
      level: 'debug',
      transports: [
        new winston.transports.File({
          filename: './logs/error.log',
          handleExceptions: true,
          level: 'error',
          maxFiles: 5,
          maxsize: 5242880,
        }),
        new winston.transports.File({
          filename: './logs/combined.log',
          handleExceptions: true,
          level: 'info',
          maxFiles: 5,
          maxsize: 5242880,
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
            myFormat,
          ),
          handleExceptions: true,
          level: 'debug', // log everything
        }),
      );
    } else if (process.env.NODE_ENV === 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
            myFormat,
          ),
          handleExceptions: true,
          level: 'info', // log everything info and above
        }),
      );
    }
  }

  public write(): winston.Logger {
    return this.logger;
  }
}
