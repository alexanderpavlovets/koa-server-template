const path = require('path');
const log4js = require('log4js');

log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    file: {
      type: 'file',
      filename: path.join(process.cwd(), './logs/main.log'),
      /*
      Logs rotation:
      When "main.log" file becomes 20MB size, it is compressed to "main.log.1.gz"
      new "main.log" is created and stores latest logs
      after it reaches 20MB, it become "main.log.1.gz", and "main.log.1.gz" become "main.log.2.gz"
      up to 10 comperessed files are stored.
      */
      maxLogSize: 20 * 1024 * 1024, // 20 MB
      backups: 10,
      compress: true
    }
  },
  categories: {
    default: { appenders: ['stdout', 'file'], level: 'all' }
  }
});

const logger = log4js.getLogger('main');

module.exports = {
  logger
};
