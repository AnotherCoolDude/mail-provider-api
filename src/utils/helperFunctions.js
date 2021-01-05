const compareDateStrings = (str1, str2) => new Date(str1).getTime() === new Date(str2).getTime();
const mapObject = (obj1, obj2) => {
  const newObj = obj1;
  Object.keys(obj1).forEach((o) => {
    newObj[o] = obj2[o];
  });
  return newObj;
};

export { compareDateStrings, mapObject };
