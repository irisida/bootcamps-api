const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

/**
 * load the env
 */
dotenv.config({ path: './config/config.env' });

/**
 * Load the models
 */
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

/**
 * DB connection
 */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

/**
 * read the JSON files
 */
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

/**
 * import into DB
 */
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);

    console.log(`Seed Data imported...`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

/**
 * delete the data
 */
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log(`Seed Data deleted...`.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
