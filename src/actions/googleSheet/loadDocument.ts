import chalk from 'chalk'
import { GoogleSpreadsheet } from 'google-spreadsheet'

export default async (
  docId: string,
  callback: (msg: string) => void,
  orFail: boolean = false
) => {
  const doc = new GoogleSpreadsheet(docId)
  doc.useApiKey(process.env.DOC_API_KEY as string)

  try {
    await doc.loadInfo()
    return doc
  } catch (error) {
    if (error) {
      callback(`Unable to locate document ${chalk.bold(docId)}`)
      if (orFail) {
        process.exit(1)
      }
    }
    return undefined
  }
}
