const db = require("../db");

const Post = db.createCollection("Post", {
  postTitle: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: 100,
  },
  postBody: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: 2000,
  },
});

exports.getPosts = async () => {
  return await Post.find();
};

exports.getPost = async (id) => {
  try {
    return await Post.findOne({ _id: id });
  } catch (err) {
    throw new Error("Unable to find post", { cause: err });
  }
};

exports.createPost = async (post) => {
  try {
    return await Post.create(post);
  } catch (err) {
    throw new Error("Error: unable to crate post: ", { cause: err });
  }
};

exports.deletePost = async (id) => {
  try {
  } catch (err) {}
};
