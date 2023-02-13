import Enquirer from 'enquirer';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import googleSheet from '../googleSheet';

export const getSheetId = async (document: GoogleSpreadsheet) => {
  const qa2 = new Enquirer<{ sheetName: string }>();

  const sheetList = googleSheet.getSheets(document);
  const { sheetName } = await qa2.prompt({
    type: 'select',
    message: 'Wich sheet you wanna read from?',
    name: 'sheetName',
    hint: `Default to ${sheetList[0].name}`,
    choices: sheetList
  });

  return (
    sheetList.find((where) => where.name === sheetName)?.value ||
    sheetList[0].value
  );
};
