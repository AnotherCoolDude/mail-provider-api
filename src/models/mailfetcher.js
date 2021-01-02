import { ImapFlow } from 'imapflow';
import * as envs from '../settings';

let lock;
const connect = async (mailbox) => {
  const client = new ImapFlow({
    host: envs.mailHost,
    port: envs.mailPort,
    secure: true,
    logger: false,
    auth: {
      user: envs.mailUser,
      pass: envs.mailPass,
    },
  });
  // Wait until client connects and authorizes
  await client.connect();
  lock = await client.getMailboxLock(mailbox);
  return client;
};

const disconnectClient = async (client) => {
  // log out and close connection
  lock.release();
  await client.logout();
  return true;
};

const fetch = async (client, date, queryMethod, mailbox, includeContent) => {
  const msg = [];
  // Select and lock a mailbox. Throws if mailbox does not exist

  // fetch latest message source
  // let message = await client.fetchOne('*', { source: true });
  // console.log(message.source.toString());

  // list subjects for all messages
  // uid value is always included in FETCH response, envelope strings are in unicode.
  const query = queryMethod === 'since' ? { since: date } : { on: date };
  // eslint-disable-next-line no-restricted-syntax
  for await (const m of client.fetch(query, {
    envelope: true,
    source: includeContent,
  })) {
    msg.push(m);
  }
  return msg;
};

export const mailFetcher = {
  connect,
  disconnectClient,
  fetch,
};
