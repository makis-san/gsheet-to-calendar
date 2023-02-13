export const columnRange = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

export const getColumnRange = (range: [string, string]): string[] =>
  columnRange.slice(
    columnRange.findIndex((where) => where === range[0]),
    columnRange.findIndex((where) => where === range[1])
  );
