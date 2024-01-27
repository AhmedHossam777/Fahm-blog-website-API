const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      validate: [validator.isEmail, 'please enter a valid email'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: false,
    },
    suspend: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Guest', 'Editor'],
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    plan: {
      type: String,
      enum: ['Free', 'Premium'],
      default: 'Free',
    },
    userAward: {
      type: String,
      enum: ['Gold', 'Silver', 'Bronze'],
      default: 'Bronze',
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
    toJSON: { virtuals: true },
  }
);

// middlewares
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// virtual properties
userSchema.virtual('fullname').get(function () {
  return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('followers count').get(function () {
  return this.followers.length;
});

userSchema.virtual('following count').get(function () {
  return this.following.length;
});

userSchema.virtual('profile views').get(function () {
  return this.viewers.length;
});

userSchema.virtual('user blocked count').get(function () {
  return this.blocked.length;
});

userSchema.virtual('post count').get(function () {
  return this.posts.length;
});


// schema methods
userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
