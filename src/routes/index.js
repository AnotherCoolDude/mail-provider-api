import express from 'express';
import { indexPage, newsletterPage, retrieveNewsletter } from '../controllers';

const indexRouter = express.Router();

indexRouter.get('/', indexPage);
indexRouter.get('/newsletter', newsletterPage);
indexRouter.get('/newsletter/sync/:date', retrieveNewsletter);

export default indexRouter;
