declare interface EventTypes {
  date: Date;
  title: string;
}

declare type FetchEventsFNOptions = {
  dateFormat: string;
  startColRange: [LettersUpperCase, LettersUpperCase];
  locale: string;
};

declare type FetchEventsFN = (
  callback: (error: string, type?: 'info' | 'warn') => void,
  docId: string,
  sheetId?: string,
  options?: FetchEventsFNOptions
) => Promise<{ events: EventTypes[]; calendarTitle: string } | undefined>;
