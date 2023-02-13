import Enquirer from 'enquirer';

export const getDocInfo = async () => {
  const qa = new Enquirer<{ docUrl: string }>();
  const { docUrl } = await qa.prompt({
    type: 'input',
    message: 'Enter the google sheet document url',
    name: 'docUrl',
    hint: 'https://docs.google.com/spreadsheets/d/123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    required: true,
    validate: (string: string) =>
      string.includes('https://docs.google.com/spreadsheets')
  });
  return {
    docUrl,
    docId: docUrl
      .replace('https://docs.google.com/spreadsheets/', '')
      .split('/')[1]
  };
};
