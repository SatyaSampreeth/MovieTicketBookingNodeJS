const mongoose = require('mongoose');
Schema = mongoose.Schema
const showtimeSchema = new mongoose.Schema({
  startAt: {
    type: String,
    required: true,
  },
  // startDate: {
  //   type: Date,
  //   required: true,
  // },
  // endDate: {
  //   type: Date,
  //   required: true,
  // },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'movie',
    required: true,
  },
  cinemaId: {
    type: Schema.Types.ObjectId,
    ref: 'cinema',
    required: true,
  },
  cityId:{
    type: Schema.Types.ObjectId,
    ref: 'location',
    required: true
  },
  seats: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('showtime', showtimeSchema);;