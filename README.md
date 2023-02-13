<p align="center">
    <img src="https://user-images.githubusercontent.com/59520975/218352265-fe2009e2-87ef-4913-a8f7-4b2451f04f88.png" height="128">
    <h1 align="center">Google Spreadsheet to Calendar</h1>
</p>

CLI api that uses google spreadsheet api to export calendar data.

<p float="left">

<img src="https://img.shields.io/github/package-json/v/makis-san/gsheet-to-calendar/main?label=Version&style=for-the-badge"/>

<img src="https://img.shields.io/github/license/makis-san/gsheet-to-calendar?style=for-the-badge"/>

</p>

## Planned releases

- Full cli support (75%)
- Web application (Working on)
- Publish to npm package registry (Working on)
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

| Argument          | Description                                                                                                   | Defaults      |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | ------------- |
| docId             | Defines the google document id                                                                                | null          |
| sheetId           | Defines the google sheet id                                                                                   | null          |
| dateFormat        | Defines the date string format.Follow [date-fns parse documentation](https://date-fns.org/v2.29.3/docs/parse) | "d 'de' MMMM" |
| dateStringColumn  | Defines wich column contains the date string                                                                  | null          |
| titleStringColumn | Defines wich column contains the event title string                                                           | null          |
| locale            | Defines the locale for the date-fns. (ISO 639-1)                                                              | ptBR          |
| startColumn       | Define the initial column                                                                                     | A             |

## Usage as a package

(Coming soon...)
