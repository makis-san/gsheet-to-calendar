import google from './google';
import ics from './ics';
import terminal from './terminal';
import json from './json';

const exportObject = {
  google,
  ics,
  terminal,
  json
};

export const exportMethods = Object.keys(exportObject);

export default exportObject;
