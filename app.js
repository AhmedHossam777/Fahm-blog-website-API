require('dotenv').config();
require('express-async-errors');

const express = require('express');
const dbConnect = require('./config/dbConnect');

const app = express();
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const categoryRouter = require('./routes/category');


//? Middleware
app.use(express.json());


//? Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/categories', categoryRouter);




const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    
    await dbConnect(process.env.MONGO_URI);
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
