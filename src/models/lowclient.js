import lowDB from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
import * as fsPath from 'path';
import { dbRelPath } from '../settings';
import { writeMailToHTMLFile } from '../utils/helperFunctions';

class LowDB {
  constructor() {
    const relPath = dbRelPath || '/db';
    this.path = fsPath.join(fsPath.resolve('./src'), relPath);
    this.htmlPath = fsPath.join(this.path, '/html');

    if (!fs.existsSync(this.htmlPath)) {
      fs.mkdirSync(this.htmlPath, { recursive: true });
      console.debug(`created path: ${this.htmlPath}`);
    }

    this.db = lowDB(new FileSync(fsPath.join(this.path, 'nl_db.json')));
    this.db
      .defaults({
        lastUpdated: '',
        newsletter: [],
      })
      .write();
  }

  getAll(path) {
    return this.db.get(path).value();
  }

  get(path, id) {
    return this.db
      .get(path)
      .find((m) => new Date(m.id).getTime() === new Date(id).getTime())
      .value();
  }

  async update(path, obj, id) {
    const o = obj;
    const src = obj.source;
    delete o.source;

    const index = this.db
      .get(path)
      .findIndex((m) => new Date(m.id).getTime() === new Date(id).getTime())
      .value();

    if (index === -1) {
      o.htmlPath = await writeMailToHTMLFile(this.htmlPath, src);
      console.log(this.db.get(path).push(o).write());
    } else {
      this.db
        .update(`${path}[${index}]`, async (m) => {
          const nPath = fs.existsSync(m.htmlPath)
            ? m.htmlPath
            : await writeMailToHTMLFile(this.htmlPath, src);
          o.htmlPath = nPath;
          return o;
        })
        .write();
    }

    this.db.set('lastUpdated', new Date()).write();
  }

  delete(path, id) {
    return this.db.get(path).remove({ id }).write();
  }
}

export default new LowDB();
