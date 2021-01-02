import { mailFetcher as mf } from './mailfetcher';
import { mailbox } from '../settings';

class Client {
  constructor() {
    this.mailbox = mailbox || 'Newsletter';
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
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
    const msg = await mf.fetch(this.client, date, 'since', this.mailbox, true);
    return msg;
  }
}

export default new Client();
