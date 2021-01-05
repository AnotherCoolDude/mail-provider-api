import { retrieveMails } from './queryFunctions';
import { mailbox } from '../settings';

(async () => {
  await retrieveMails(mailbox, new Date('2020-12-01'));
})();
