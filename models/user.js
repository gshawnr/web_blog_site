const { createCollection } = require("../db");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const schema = {
  username: {
    type: String,
    // required: true,
    unique: true,
  },
};

const User = createCollection("user", schema, [
  passportLocalMongoose,
  findOrCreate,
]);

User.getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    throw new Error("getUserById error", { cause: err });
  }
};

exports.User = User;
