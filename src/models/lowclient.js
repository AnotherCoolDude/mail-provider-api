import lowDB from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
import * as fsPath from 'path';
import { dbRelPath } from '../settings';

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

  get(path, compareFunc = undefined) {
    return this.db
      .get(path)
      .filter((m) => (compareFunc ? compareFunc(m) : true))
      .value();
  }

  updateOrCreate(path, obj, compareFunc = undefined) {
    // check if path exists
    if (!this.db.has(path).value()) {
      // if not, create
      return this.db.set(path, obj).write();
    }

    // is path array?
    if (!this.db.get(path).isArray().value()) {
      // if not, simply override the value
      return this.db.set(path, obj).write();
    }

    // try to update existing value
    let updated = false;
    const res = this.db
      .get(path)
      .find((val) => {
        updated = compareFunc ? compareFunc(val) : val === obj;
        return updated;
      })
      .assign(obj)
      .write();

    // if existing value could not be found, append the new value
    if (!updated) {
      return this.db.get(path).push(obj).write();
    }

    return res;
  }

  delete(path, id) {
    return this.db.get(path).remove({ id }).write();
  }
}

export default new LowDB();
