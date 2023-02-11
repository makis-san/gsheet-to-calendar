declare interface EventTypes {
  date: Date;
  title: string;
}

declare type FetchEventsFN = (
  callback: (error: string, type?: 'info' | 'warn') => void,
  docId: string,
  sheetId?: string
) => Promise<{ events: EventTypes[]; calendarTitle: string } | undefined>;
