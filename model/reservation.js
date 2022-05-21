const mongoose = require('mongoose');
Schema = mongoose.Schema
// const { Schema } = mongoose;
const reservationSchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     required: true,
//   },
  showId: {
    type: String,
    required: true,
    trim: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
//   phone: {
//     type: String,
//     required: true,
//   },
//   checkin: {
//     type: Boolean,
//     default: false,
//   },
});

// const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = mongoose.model('reservation', reservationSchema);
// module.exports = Reservation;