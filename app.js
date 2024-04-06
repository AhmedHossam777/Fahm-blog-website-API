require('dotenv').config();
require('express-async-errors');

const express = require('express');
const dbConnect = require('./config/dbConnect');

const app = express();
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const categoryRouter = require('./routes/category');
const notFound = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/globalErrorHandler');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

//? Middleware
app.use(cookieParser(process.env.COOKIE_SECRET));

// Allow requests from your front-end
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Set security HTTP headers
app.use(helmet());

// Data sanitization against XSS
app.use(xss());

// CORS configuration
app.use(
  cors({
    origin: 'http://127.0.0.1:8080', // replace with your front-end's URL
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(express.json({ limit: '10kb' })); // limit to 10kb for security

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//? Routes
app.get('/', (req, res) => {
  res.send('Welcome to the blog API');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/categories', categoryRouter);

//? Error handling middleware
app.use(errorHandlerMiddleware);
app.use(notFound);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  try {
    await dbConnect();
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
