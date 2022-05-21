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

// showtimeSchema.pre('save',async function(next){
//   const showtime=this;
//   let total=0
//   // if(showtime.isModified('seats')){
//     for(let i in seats){
//       for (let j in i){
//         total+=1
//       }
//     }
//       showtime.seatsAvailable=total
//   // }
  
  
//   next();
//   }
//   )
  

module.exports = mongoose.model('showtime', showtimeSchema);;