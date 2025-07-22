const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "User" }
);

const postSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    categories: { type: Array, default: [] },
    draft: { type: Boolean, required: true, default: false },
    tags: { type: Array, default: [] },
    media: { type: Array, default: [] },
    authorName: { type: String, required: true },
    authorId: { type: mongoose.Types.ObjectId, required: true },
    publishDate: { type: Date },
    views: { type: Number, default: 0 },
    visitors: { type: Array, default: [] },
    comments: { type: Array, default: [] },
  },
  { collection: "Post", timestamps: true }
);

let collection = {};

collection.getUserCollection = async () => {
  try {
    return (await mongoose.connect(process.env.MONGO_URI)).model(
      "User",
      userSchema
    );
  } catch (err) {
    let error = new Error("Could not connect to database");
    error.status = 500;
    throw error;
  }
};

collection.getPostCollection = async () => {
  try {
    return (await mongoose.connect(process.env.MONGO_URI)).model(
      "Post",
      postSchema
    );
  } catch (err) {
    let error = new Error("Could not connect to database");
    error.status = 500;
    throw error;
  }
};

module.exports = collection;
