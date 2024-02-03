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
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
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
    toJSON: { virtuals: true },
  }
);

postSchema.pre('save', async function (next) {
  const user = await User.findById(this.user);

  if (user.posts.length >= 10) {
    await User.findByIdAndUpdate(
      this.user,
      {
        userAward: 'Gold',
      },
      { new: true }
    );
  } else if (user.posts.length >= 5) {
    await User.findByIdAndUpdate(
      this.user,
      {
        userAward: 'Silver',
      },
      { new: true, runValidators: true, virtuals: true }
    );
  }

  await user.save();

  next();
});

postSchema.pre(/^find/, function (next) {
  postSchema.virtual('views count').get(function () {
    return this.views.length;
  });

  next();
});

postSchema.virtual('likes count').get(function () {
  return this.likes.length;
});

postSchema.virtual('dislikes count').get(function () {
  return this.dislikes.length;
});
postSchema.virtual('comments count').get(function () {
  return this.comments.length;
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
