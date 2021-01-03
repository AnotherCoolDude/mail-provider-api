import { simpleParser } from 'mailparser';
import path from 'path';
import { writeFileSync } from 'fs';
import { nanoid } from 'nanoid';

const writeMailToFile = (dirPath, source) => {
  const fullPath = path.join(dirPath, `${nanoid(5)}.html`);
  simpleParser(source).then((mail) => {
    if (!mail.html) {
      console.log('error: no body to parse');
      return false;
    }
    writeFileSync(fullPath, mail.html);
    return true;
  });
  return fullPath;
};

const compareDateStrings = (str1, str2) => new Date(str1).getTime() === new Date(str2).getTime();

export { writeMailToFile, compareDateStrings };
