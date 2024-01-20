const getPosts = async (req, res) => {
  res.send('Get all posts');
}


const getPost = async (req, res) => {
  res.send('Get post');
}

const createPost = async (req, res) => {
  res.send('Create post');
}

module.exports = {
  getPosts,
  getPost,
  createPost
}