const createCategory = async(req,res) => {
  res.send('create category');
}

const getCategories = async(req,res) => {
  res.send('get categories');
}

const getCategory = async(req,res) => {
  res.send('get category');
}

module.exports = {
  createCategory,
  getCategories,
  getCategory
}