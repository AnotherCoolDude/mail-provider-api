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
    return this.low.get(property, compareFunc);
  }

  insert(path, obj, compareFunc = undefined) {
    return this.low.updateOrCreate(path, obj, compareFunc);
  }

  saveAsset(filename, data, override = false) {
    return this.low.saveAsset(filename, data, override);
  }
}

export default Model;
