import cliSpinners from 'cli-spinners'
import ora from 'ora'
import { isSilent } from '../logger'

export const useSpinner = (initialText: string) => {
  const oraInstance = ora({
    text: initialText,
    spinner: cliSpinners.dots,
    isEnabled: !isSilent,
    isSilent
  })

  return oraInstance
}
