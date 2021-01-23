import fs from 'fs';
import lowdb from './lowclient';

class Model {
  constructor(dbName, model) {
    this.model = model;
    this.low = lowdb.selectDB(dbName, model);
  }

  select(property, compareFunc = undefined) {
    if (!Object.keys(this.model).includes(property)) {
      throw new Error(`${property} not found in model ${this.model}`);
    }
    const nlWithAssets = this.loadAsset(this.low.get(property, compareFunc));
    console.log(nlWithAssets);
    return nlWithAssets;
  }

  insert(path, obj, compareFunc = undefined) {
    return this.low.updateOrCreate(path, obj, compareFunc);
  }

  saveAsset(filename, data, override = false) {
    return this.low.saveAsset(filename, data, override);
  }

  // eslint-disable-next-line class-methods-use-this
  loadAsset(objArray) {
    return objArray.map(obj => {
      if (!fs.existsSync(obj.htmlPath)) {
        console.log(`error reading file: ${obj.htmlPath} not existing`);
        return obj;
      }
      console.log(obj);
      const data = fs.readFileSync(obj.htmlPath);
      const html = data.toString();
      return { ...obj, html };
    });
  }
}

export default Model;
