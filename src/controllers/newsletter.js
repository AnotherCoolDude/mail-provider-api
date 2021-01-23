import Model from '../models/model';
import { retrieveMails } from '../utils/queryFunctions';
import { compareDateStrings } from '../utils/helperFunctions';

const modelObj = {
  lastUpdated: '',
  newsletter: [],
};

const nlModel = new Model('nl_db.json', modelObj);

export const newsletterPage = async (req, res) => {
  try {
    res.status(200).json(nlModel.select('newsletter'));
  } catch (err) {
    res.status(200).json({ error: err });
  }
};

// eslint-disable-next-line consistent-return
export const retrieveNewsletter = async (req, res) => {
  if (new Date(req.params.date) === 'Invalid Date') {
    return res
      .status(200)
      .json({ error: 'Invalid Date. Date must be formatted as YYYY-MM-DD' });
  }
  const mails = await retrieveMails('Newsletter', new Date(req.params.date));
  mails.forEach((m) => {
    const newNL = {
      envelope: m.envelope,
      id: m.envelope.date,
      htmlPath: nlModel.saveAsset(
        `${Date.parse(m.envelope.date)}.html`,
        m.source
      ),
    };
    nlModel.insert('newsletter', newNL, (nl) => compareDateStrings(newNL.id, nl.id));
  });
  const lastUpdated = new Date();
  nlModel.insert('lastUpdated', lastUpdated);
  res.status(200).json({ lastUpdated, amount: mails.length });
};
