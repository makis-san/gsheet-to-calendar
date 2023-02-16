import Enquirer from 'enquirer'
import _export, { exportMethods } from '../../export'

export const exportPrompt = async () => {
  const select = await new Enquirer<{
    export?: keyof typeof _export
  }>()
    .prompt({
      type: 'select',
      name: 'export',
      message: 'Select an export method',
      choices: exportMethods
    })
    .catch(() => ({ export: undefined }))

  return select
}
