import Table from 'cli-table';
import { format } from 'date-fns';

export default (calendarTitle: string, events: EventTypes[]) => {
  const data = events.reduce((acc, cur) => {
    const month = format(new Date(cur.date), 'MMMM');

    return {
      ...acc,
      [month]: [...(acc[month] ? acc[month] : []), cur.title]
    };
  }, {});

  const table = new Table({ head: Object.keys(data) });

  table.push(
    Object.keys(data).reduce(
      (acc, cur) => [...acc, cur.length.toString()],
      [] as string[]
    )
  );

  console.log(table.toString());
};
