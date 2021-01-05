import lowDB from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
import * as fsPath from 'path';
import { dbRelPath } from '../settings';

class LowDB {
  constructor() {
    const relPath = dbRelPath || '/db';
    this.path = fsPath.join(fsPath.resolve('./src'), relPath);
    this.assetsPath = fsPath.join(this.path, '/assets');
    this.db = undefined;

    if (!fs.existsSync(this.assetsPath)) {
      fs.mkdirSync(this.assetsPath, { recursive: true });
      console.debug(`created path: ${this.assetsPath}`);
    }
  }

  selectDB(dbName, defaultValue = undefined) {
    this.db = lowDB(
      new FileSync(fsPath.join(this.path, dbName), {
        defaultValue: defaultValue || {},
      })
    );
    return this;
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
      // if not assign to path
      return this.db.get(path).assign(obj).write();
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

    return obj;
  }

  delete(path, compareFunc) {
    return this.db
      .get(path)
      .remove((v) => compareFunc(v))
      .write();
  }

  saveAsset(filename, data, override = false) {
    const path = fsPath.join(this.assetsPath, filename);
    if (fs.existsSync(path) && !override) {
      console.log(`file ${filename} already exists at path ${path}`);
      return path;
    }
    fs.writeFileSync(path, data);
    return path;
  }
}

export default new LowDB();
