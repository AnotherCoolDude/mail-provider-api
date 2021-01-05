import { simpleParser } from 'mailparser';
import { mailFetcher as mf } from './mailfetcher';

class MailClient {
  constructor() {
    this.mailbox = '';
    this.connected = false;
  }

  async connect(mailbox) {
    if (!this.connected) {
      this.mailbox = mailbox;
      this.client = await mf.connect(this.mailbox);
      this.connected = true;
    }
    return this.connected;
  }

  async disconnect() {
    const succ = await mf.disconnectClient(this.client);
    return succ;
  }

  async fetch(date) {
    if (!this.connected) {
      console.error('client not connected');
      return [];
    }
    const msg = await mf.fetch(this.client, date, 'since', true);

    // convert source to better handle data
    const pp = [];
    msg.forEach(m => {
      pp.push(simpleParser(m.source));
    });
    const res = await Promise.all(pp);
    res.forEach((v, i) => {
      msg[i].source = v.html;
    });
    return msg;
  }
}

export default new MailClient();
