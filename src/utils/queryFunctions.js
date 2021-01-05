import mailclient from '../models/mailclient';
import lowdb from '../models/lowclient';
import { compareDateStrings } from './helperFunctions';

const getMails = (mailbox, id = undefined) => lowdb.get(
  mailbox.toLowerCase(),
  id ? (nl) => compareDateStrings(nl.id, id) : undefined
);

const retrieveMails = async (mailbox, since) => {
  await mailclient.connect(mailbox);
  const mails = await mailclient.fetch(since);
  await mailclient.disconnect();
  console.table(mails);
  return mails;
};

export { retrieveMails, getMails };
