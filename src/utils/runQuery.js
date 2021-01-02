import { retrieveMails, getMails } from './queryFunctions';

(async () => {
  await retrieveMails(new Date('2020-12-01'));
  getMails();
})();
