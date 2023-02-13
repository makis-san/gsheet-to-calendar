import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import init from './actions/init';
import * as dotenv from 'dotenv';
import { exportMethods } from './export';

dotenv.config();

const cliOptions = yargs(hideBin(process.argv))
  .option('docId', {
    type: 'string',
    group: 'Sheet options',
    description: 'Sets google spreadsheet id'
  })
  .option('sheetId', {
    type: 'string',
    group: 'Sheet options',
    description: 'Sets google sheet id'
  })
  .option('dateFormat', {
    type: 'string',
    alias: 'dFormat',
    group: 'Sheet options',
    default: `d 'de' MMMM`,
    description:
      'Defines the date format that the cli should look for at cells. Follow date-fns parse instructions.'
  })
  .option('dateStringColumn', {
    type: 'string',
    alias: 'dateStrCol',
    group: 'Sheet options',
    description: 'Defines wich column contains the date string'
  })
  .option('titleStringColumn', {
    type: 'string',
    alias: 'titleStrCol',
    group: 'Sheet options',
    description: 'Defines wich column contains the event title string'
  })
  .option('locale', {
    type: 'string',
    group: 'Sheet options',
    description: 'Defines the locale for the date-fns. (ISO 639-1)',
    default: 'pt-Br'
  })
  .option('startColumn', {
    type: 'string',
    group: 'Sheet options',
    description: 'Define the initial column'
  })
  .option('silent', {
    type: 'boolean',
    group: 'Execution options',
    alias: 's',
    implies: ['docId', 'exportAs'],
    description: 'Run in silent mode'
  })
  .option('exportAs', {
    alias: 'as',
    group: 'Export options',
    choices: exportMethods,
    description: 'Defines the export method.'
  })
  .option('googleToken', {
    alias: 'gToken',
    group: 'Export options',
    type: 'string',
    description:
      'Sets google token (will automatically export to google calendar)'
  })
  .command('$0', 'Runs the process', (args) => {
    init(args.argv);
  })
  .parse();

export type CLIArguments = typeof cliOptions;

export default cliOptions;
