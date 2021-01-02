import client from '../models/mailclient';
import lowdb from '../models/lowclient';
import Model from '../models/model';

const retrieveMails = async (dateSince) => {
  await client.connect();
  const msg = await client.fetch(dateSince);

  msg.map((m) => lowdb.update(
    'newsletter',
    new Model(m.envelope.date, m.envelope, '', m.source),
    m.envelope.date
  ));

  const success = await client.disconnect();
  console.log(
    `retrieved and updated ${msg.length} mails\ndisconnected: ${success}`
  );
};

const getMails = () => lowdb.getAll('newsletter');

const getMail = (id) => lowdb.get('newsletter', id);

export { retrieveMails, getMail, getMails };
