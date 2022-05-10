const mongoose = require('mongoose');

const { Schema } = mongoose;
const reservationSchema = new Schema({
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
    ref: 'Movie',
    required: true,
  },
  cinemaId: {
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  cityId:{
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  }
//   userid: {
//     type: String,
//     required: true,
//   },
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