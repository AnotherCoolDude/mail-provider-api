import { simpleParser } from 'mailparser';
import path from 'path';
import { writeFileSync } from 'fs';
import { nanoid } from 'nanoid';

const writeMailToHTMLFile = async (dirPath, source) => {
  const mail = await simpleParser(source);
  if (!mail.html) {
    console.log('error: no body to parse');
    return '';
  }
  const fullPath = path.join(dirPath, `${nanoid(5)}.html`);
  writeFileSync(fullPath, mail.html);
  return fullPath;
};

export { writeMailToHTMLFile };
