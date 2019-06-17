export default class Logger {
  level: string = 'verbose';
  output_list: string[] = [];

  constructor(level?: string) {
    this.level = level ? level : 'verbose';
  }

  write(msg: string, msg_level: string = 'debug') {
    let l: string = '[    ]';
    if (msg_level == 'info') {
      l = '\x1b[34m[INFO ]\x1b[0m';
    } else if (msg_level == 'error') {
      l = '\x1b[31m[ERROR]\x1b[0m';
    } else if (msg_level == 'warn') {
      l = '\x1b[5m\x1b[33m[WARN ]\x1b[0m';
    } else if (msg_level == 'debug') {
      l = '\x1b[38;5;244m[DEBUG]';
    }
    let d: Date = new Date();
    let time: string =
      '[' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.toLocaleTimeString() + ']';
    if (this.level == 'verbose') {
      console.log(l + time + '[discord.ts] ' + msg + '\x1b[0m');
    } else if (this.level == 'cmd') {
      this.output_list.push(l + time + '[discord.ts] ' + msg + '\x1b[0m');
    }
  }
}
