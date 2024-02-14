require('express-async-errors');


const Category = require('../models/Category');
const AppError = require('../utils/AppError');

const createCategory = async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next(new AppError('please provide a title', 400));
  }

  const isDup = await Category.findOne({ title: title, user: req.user.id});

  if (isDup) {
    return next(new AppError('category is already exist', 400));
  }

  const category = await Category.create({ title: title, user: req.user.id });

  res.status(201).json({
    status: 'success',
    category,
  });
};

const getCategories = async (req, res, next) => {
  const categories = await Category.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    categories,
  });
};

const getCategory = async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
  });

  if (!category) {
    return next(
      new AppError(
        'there is no categories with the provided id for this user',
        400
      )
    );
  }

  res.status(200).json({
    status: 'success',
    category,
  });
};

const updateCategory = async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    next(new AppError('please provide a title to update this category!', 400));
  }

  const category = await Category.findOne({
    user: req.user.id,
    _id: req.params.id,
  });

  if (!category) {
    return next(
      new AppError(
        'there is no categories with the provided id for this user',
        400
      )
    );
  }

  await category.updateOne({ title: title }, { new: true });
  await category.save();

  res.status(200).json({
    status: 'success',
    category,
  });
};

const deleteCategory = async (req, res, next) => {
  const category = await Category.findOne({
    user: req.user.id,
    _id: req.params.id,
  });

  if (!category) {
    return next(
      new AppError(
        'there is no categories with the provided id for this user',
        400
      )
    );
  }

  await category.deleteOne();
  res.status(204).json({
    status: 'success',
    message: 'category deleted successfully',
  });
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
