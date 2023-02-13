import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import init from './actions/init';

// dateFormat: string;
// startColRange: [LettersUpperCase, LettersUpperCase];
// locale: string;
export default yargs(hideBin(process.argv))
  .command('$0', 'Runs the process', () => {
    init();
  })
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
  .option('locale', {
    type: 'string',
    group: 'Sheet options',
    description: 'Defines the locale for the date-fns. (ISO 639-1)',
    default: 'pt-Br'
  })
  .option('startFrom', {
    type: 'array',
    group: 'Sheet options',
    description: 'Define the initial column range',
    default: ['A', 'E']
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
    choices: ['google', 'ics'],
    description: 'Defines the export method (google or ics).'
  })
  .option('googleToken', {
    alias: 'gToken',
    group: 'Export options',
    type: 'string',
    description:
      'Sets google token (will automatically export to google calendar)'
  })
  .parse();
