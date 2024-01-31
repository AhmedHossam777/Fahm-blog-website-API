const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'category title is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    posts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Post', require: true },
    ],
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
