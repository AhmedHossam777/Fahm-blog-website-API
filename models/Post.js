const mongoose = require('mongoose');
const User = require('./User');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'post title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'post description is required'],
      trim: true,
    },
    category: {
      type: String,
      ref: 'Category',
      required: [true, 'post category is required'],
    },
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'post author is required'],
      },
    ],
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

postSchema.pre('save', async function (next) {
  const user = await User.findById(this.user);

  if (user.posts.length >= 10) {
    await User.findByIdAndUpdate(
      this.user,
      {
        userAward: 'gold',
      },
      { new: true }
    );
  } else if (user.posts .length>= 5) {
    await User.findByIdAndUpdate(
      this.user,
      {
        userAward: 'silver',
      },
      { new: true }
    );
  }

  await user.save();

  next();
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
