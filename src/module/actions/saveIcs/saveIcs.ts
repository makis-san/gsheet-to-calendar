import { addDays, format } from 'date-fns';
import * as ics from 'ics';
import { log } from '../../../utils';
import { SaveIcsFN } from './saveIcs.types';

export const saveICS: SaveIcsFN = async (props) => {
  const { events } = props;

  const parsedEvents = events.map(
    (event) =>
      ({
        title: event.title,
        start: format(event.date, 'yyyy-M-d')
          .split('-')
          .reduce(
            (acc, cur) => [...acc, Number(cur)],
            [] as number[]
          ) as ics.DateArray,
        end: format(addDays(event.date, 1), 'yyyy-M-d')
          .split('-')
          .reduce(
            (acc, cur) => [...acc, Number(cur)],
            [] as number[]
          ) as ics.DateArray
      } as ics.EventAttributes)
  );

  const { error, value } = ics.createEvents(parsedEvents);

  if (error) {
    log.error(error.name);
    return;
  }

  if (!value) return;

  const buffer = Buffer.from(value);

  return {
    buffer,
    base64: buffer.toString('base64')
  };
};

export * from './saveIcs.types';
