const DB = require("mongoose");
require("dotenv").config();

const url = "mongodb://localhost:27017/BlogDB";
const onlineUrl = ``;

DB.connect(url);

exports.createCollection = (name, schema) => {
  const collectionSchema = new DB.Schema(schema);
  return DB.model(name, collectionSchema);
};
