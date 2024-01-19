require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/dbConnect');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, async () => {
  try {
    
    await dbConnect(process.env.MONGO_URI);
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
