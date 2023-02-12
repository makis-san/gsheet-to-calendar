import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

export default yargs(hideBin(process.argv))
  .option('silent', {
    alias: 's',
    type: 'boolean',
    description: 'Run in silent mode'
  })
  .option('googleToken', {
    alias: 'gToken',
    type: 'string',
    description:
      'Sets google token (will automatically export to google calendar)'
  });
