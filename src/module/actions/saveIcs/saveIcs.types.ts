export interface SaveIcsProps {
  events: EventTypes[];
}

export type SaveIcsReturn = Promise<
  { buffer: Buffer; base64: string } | undefined
>;

export type SaveIcsFN = (props: SaveIcsProps) => SaveIcsReturn;
