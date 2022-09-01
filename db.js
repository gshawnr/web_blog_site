const DB = require("mongoose");

DB.connect(process.env.DB_LOCAL_URL);

exports.createCollection = (name, schema, plugins = []) => {
  const Schema = new DB.Schema(schema);

  if (plugins.length > 0) {
    plugins.forEach((plugin) => {
      Schema.plugin(plugin);
    });
  }
  return DB.model(name, Schema);
};
