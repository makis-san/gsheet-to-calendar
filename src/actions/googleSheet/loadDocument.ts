import chalk from 'chalk';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async (docId: string, callback: (msg: string) => void) => {
  const doc = new GoogleSpreadsheet(docId);
  doc.useApiKey(process.env.DOC_API_KEY || '');

  await doc.loadInfo().catch((error) => {
    if (error) {
      callback(`Unable to locate document ${chalk.bold(docId)}`);
      process.exit(1);
    }
  });

  return doc;
};
