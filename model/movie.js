const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
  },
  language: {
    type: String,
    required: true,
    lowercase: true,
  },
  genre: {
    type: String,
    required: true,
    lowercase: true,
  },
  // director: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  // },
  // cast: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  // },
  // description: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  // },
  // duration: {
  //   type: Number,
  //   required: true,
  // },
  // releaseDate: {
  //   type: Date,
  //   required: true,
  // },
  // endDate: {
  //   type: Date,
  //   required: true,
  // },
});

module.exports = mongoose.model('movie', movieSchema);