import createIcsFile from './createIcsFile'

export default (calendarTitle: string, events: EventTypes[]) =>
  createIcsFile(calendarTitle, events)
