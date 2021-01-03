import { existsSync } from 'fs';
import client from '../models/mailclient';
import lowdb from '../models/lowclient';
import Model from '../models/model';
import { writeMailToFile, compareDateStrings } from './helperFunctions';

const retrieveMails = async (dateSince) => {
  await client.connect();
  const msg = await client.fetch(dateSince);

  msg.map((m) => {
    const existing = lowdb.get('newsletter', (n) => compareDateStrings(n.id, m.envelope.date))[0];
    let path = existing.htmlPath;
    if (existing !== undefined && !existsSync(existing.htmlPath)) {
      path = writeMailToFile(lowdb.htmlPath, m.source);
    }
    return lowdb.updateOrCreate(
      'newsletter',
      new Model(m.envelope.date, m.envelope, path),
      (val) => compareDateStrings(val.id, m.envelope.date)
    );
  });
  const dateUpdated = new Date();
  lowdb.updateOrCreate('lastUpdated', dateUpdated);
  await client.disconnect();
  console.log(
    `${dateUpdated.toLocaleString('de-DE')}: retrieved and updated ${msg.length} mail since ${dateSince.toLocaleString('de-DE')}`
  );
};

const getMails = (id = undefined) => lowdb.get(
  'newsletter',
  id ? (nl) => compareDateStrings(nl.id, id) : undefined
);

export { retrieveMails, getMails };
