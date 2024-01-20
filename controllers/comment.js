const getComments = async (req, res) => {
  res.send('get all comments')
}

const getComment = async (req,res) => {
  res.send('get comment')
}


const createComment = async(req,res) => {
  res.send('create comment')
}

module.exports = {
  getComments,
  getComment,
  createComment
}