const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `SUCCESS::MongoDB connected: ${conn.connection.host}`.green.inverse.bold
  );
};

module.exports = connectDB;
