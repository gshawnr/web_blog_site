const DB = require("mongoose");

// DB URL Strings
const localUrl = "mongodb://localhost:27017/BlogDB";
const onlineUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@gsr-mongo-cluster.kkuknqw.mongodb.net/BlogDB?retryWrites=true&w=majority`;

DB.connect(onlineUrl);

exports.createCollection = (name, schema) => {
  const collectionSchema = new DB.Schema(schema);
  return DB.model(name, collectionSchema);
};
