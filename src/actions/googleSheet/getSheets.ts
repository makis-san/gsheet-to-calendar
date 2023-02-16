import { GoogleSpreadsheet } from 'google-spreadsheet'

export default (doc: GoogleSpreadsheet) => {
  return doc.sheetsByIndex.reduce(
    (acc, cur) => [
      ...acc,
      {
        value: cur.sheetId,
        name: cur.title
      }
    ],
    [] as { value: string; name: string }[]
  )
}
