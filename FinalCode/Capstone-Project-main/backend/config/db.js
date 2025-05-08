const mongoose = require('mongoose');

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDb connected succesfully')
  }
  catch (err) {
    console.error('MongoDb connection error', err);
    process.exit(1);
  }
};
module.exports = connectDB;