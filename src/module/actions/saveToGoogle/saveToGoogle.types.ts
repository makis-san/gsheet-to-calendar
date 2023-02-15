export interface SaveToGoogleProps {
  calendarTitle: string;
  events: EventTypes[];
  accessToken: string;
}

export type SaveToGoogleFN = (props: SaveToGoogleProps) => Promise<void>;
