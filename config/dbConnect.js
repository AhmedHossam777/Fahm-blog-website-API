const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err}`);
  connectDB();
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('App is terminated');
  process.exit(0);
});

module.exports = dbConnect;
