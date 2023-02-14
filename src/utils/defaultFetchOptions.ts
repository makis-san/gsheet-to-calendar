import { FetchEventsFNOptions } from '../actions/fetchEvents/fetchEvents.types';

export const defaultFetchOptions: FetchEventsFNOptions = {
  dateFormat: `d 'de' MMMM`,
  startColumn: 'A',
  locale: 'ptBR'
};
