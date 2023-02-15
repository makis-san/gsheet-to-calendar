<p align="center">
    <img src="https://user-images.githubusercontent.com/59520975/218352265-fe2009e2-87ef-4913-a8f7-4b2451f04f88.png" height="128">
    <h1 align="center">Google Spreadsheet to Calendar</h1>
</p>

CLI app and package that uses google spreadsheet api to export calendar data directly into google agenda or other supported methods :)

<p float="left">

<img src="https://img.shields.io/github/package-json/v/makis-san/gsheet-to-calendar/main?label=Version&style=for-the-badge"/>

<a href="https://www.npmjs.com/package/gsheet-to-calendar">
<img src="https://img.shields.io/npm/v/gsheet-to-calendar?color=CC3534&style=for-the-badge"/>
</a>

<a href="https://github.com/makis-san/gsheet-to-calendar/issues">
<img src="https://img.shields.io/github/issues-raw/makis-san/gsheet-to-calendar?color=blue&style=for-the-badge"/>
</a>
  
<a href="https://github.com/makis-san/gsheet-to-calendar/pulls">
<img src="https://img.shields.io/github/issues-pr-raw/makis-san/gsheet-to-calendar?color=blue&style=for-the-badge"/>
</a>

<a href="https://github.com/makis-san/gsheet-to-calendar/blob/main/LICENSE.md">
<img src="https://img.shields.io/github/license/makis-san/gsheet-to-calendar?style=for-the-badge"/>
</a>
  
</p>

## Planned releases

- Web application (Working on)
- Publish to homebrew

## Supported exports

| Method   | Status                                                                           |     |
| -------- | -------------------------------------------------------------------------------- | --- |
| Google   | Only with access_token or by integrating with valid google oauth api credentials | ⚠️  |
| ICS      | Fully supported                                                                  | ✅  |
| JSON     | Fully supported                                                                  | ✅  |
| Terminal | Fully supported                                                                  | ✅  |

## CLI usage

```sh
# Run
$ gsToCalendar
```

| Props                     | Description                                                                                                   | Required | Default       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| sheetId                   | Google sheet id from current document                                                                         | false    | null          |
| options                   | Options object                                                                                                | false    | null          |
| options.debug             | Enable error logging                                                                                          | false    | false         |
| options.docId             | Defines the google document id                                                                                | false    | null          |
| options.sheetId           | Defines the google sheet id                                                                                   | false    | null          |
| options.dateFormat        | Defines the date string format.Follow [date-fns parse documentation](https://date-fns.org/v2.29.3/docs/parse) | false    | "d 'de' MMMM" |
| options.dateStringColumn  | Defines wich column contains the date string                                                                  | false    | null          |
| options.titleStringColumn | Defines wich column contains the event title string                                                           | false    | null          |
| options.locale            | Defines the locale for the date-fns. (ISO 639-1)                                                              | false    | ptBR          |
| options.startColumn       | Define the initial column                                                                                     | false    | A             |

## Usage as a package

Install the package using your favorite package manager.

```shell
$ npm i gsheet-to-calendar
```

Add the following enviroment variable:

```ts
// .env
// https://developers.google.com/sheets

DOC_API_KEY= Your google spreadsheet api key
```

### Example snippet

Here's a basic usage of the package.

```ts
// yourApiRoute.ts

import { loadSheetDocument } from 'gsheet-to-calendar';

export const handle = async (documentUrl: string) => {
  const data = await loadSheetDocument({
    url: documentUrl
  });

  if (!document) return;

  const events = await data.fetchEvents();

  if (!events) return;

  return events.saveToGoogle(body.token as string);
};
```

### loadSheetDocument()

| Props | Description                     | Required |
| ----- | ------------------------------- | -------- |
| url   | Google spreadsheet document url | true     |

```ts
// Return of loadSheetDocument()

document: GoogleSpreadsheet; // Read more at https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#spreadsheetproperties
sheetList: [{
  value: string;
  name: string;
}, ...]
fetchEvents: () => Promise<{...}>;
```

### fetchEvents()

Fetch events from the spreadsheet and return.

| Props                     | Description                                                                                                   | Required | Default       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| sheetId                   | Google sheet id from current document                                                                         | false    | null          |
| options                   | Options object                                                                                                | false    | null          |
| options.debug             | Enable error logging                                                                                          | false    | false         |
| options.docId             | Defines the google document id                                                                                | false    | null          |
| options.sheetId           | Defines the google sheet id                                                                                   | false    | null          |
| options.dateFormat        | Defines the date string format.Follow [date-fns parse documentation](https://date-fns.org/v2.29.3/docs/parse) | false    | "d 'de' MMMM" |
| options.dateStringColumn  | Defines wich column contains the date string                                                                  | false    | null          |
| options.titleStringColumn | Defines wich column contains the event title string                                                           | false    | null          |
| options.locale            | Defines the locale for the date-fns. (ISO 639-1)                                                              | false    | ptBR          |
| options.startColumn       | Define the initial column                                                                                     | false    | A             |

```ts
// Return of fetch events()

events: EventTypes[];
saveToGoogle: (accessToken: string) => Promise<void>;
calendarTitle: string;
```

### EventTypes

```ts
interface EventTypes {
  date: Date;
  title: string;
}
```

### saveToGoogle()

Save events to google calendar.

| Props       | Description               | Required |
| ----------- | ------------------------- | -------- |
| accessToken | Google OAuth access_token | true     |

## Standalone functions

You can also import each function and execute it directly anytime.

```ts
import { fetchEvents, googleSheet, saveToGoogle } from 'gsheet-to-calendar';

fetchEvents(document, {
  sheetId,
  options: {
    dateFormat,
    locale,
    startColumn,
    dateStringColumn,
    debug,
    titleStringColumn
  }
});

googleSheet.loadDocument(url, (error) => console.log(error));
googleSheet.getSheets(document);

saveToGoogle(calendarTitle, events, accessToken);
```
