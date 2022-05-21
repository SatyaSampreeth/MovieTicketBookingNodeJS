
const express = require("express");
const router = express.Router()
const Showtime = require("../model/showtime");
const auth = require("../middleware/auth");
const Movie = require("../model/movie");
const Cinema = require("../model/cinema");
const Location = require("../model/location");
const User = require("../model/user");
const Reservation = require("../model/reservation");


// Creating a reservation
router.post('/add', async (req, res) => {
    const reservation = new Reservation(req.body);
    try {
      const oldreservation = await Reservation.findOne( req.body );
  
      if (oldreservation) {
        return res.status(409).send("Movie Already Exist. Please try again");
      }
      await reservation.save();
      res.status(201).json(reservation);
    } catch (e) {
      res.status(400).json(e);
    }
  });

  // Get all reservations for the admin
  router.get('/all', async(req,res)=>{

    try{
      const reservation = await Reservation.find();
    let display=[]
    let obj={}
    // console.log('hii',reservation)
    for (let item of reservation){
      // console.log(item.cityId,item.movieId)
      // all.push(item)
      const location = await Location.findById(item.cityId)
      const movie = await Movie.findById(item.movieId)
      const cinema = await Cinema.findById(item.cinemaId)
      const show = await Showtime.findById(item.showId)
      const user = await User.findById(item.userId)
      // console.log(cinema)
      obj={
        city:location.city,
        title:movie.title,
        cinema:cinema.name,
        show:show.startAt,
        seats:item.seats,
        ticketPrice:item.ticketPrice,
        total:item.total,
        user:user.email
      }   
      console.log(obj)
      display.push(obj)   
    }
    // console.log(all)
    // const movie = await Movie.findOne({title:req.params.title});
        res.status(200).json(display);
    }
    catch(err){
        res.status(400).json(err);
    }
})   

//get reservations based on id for user
router.get('/:userId', async(req,res)=>{
  console.log(req.params.userId)
  try{
    const reservation = await Reservation.find({userId:req.params.userId})
    // let all=[]
    let display=[]
    let obj={}
    // console.log('hii',reservation)
    for (let item of reservation){
      // console.log(item.cityId,item.movieId)
      // all.push(item)
      const location = await Location.findById(item.cityId)
      const movie = await Movie.findById(item.movieId)
      const cinema = await Cinema.findById(item.cinemaId)
      const show = await Showtime.findById(item.showId)
      // console.log(cinema)
      obj={
        city:location.city,
        title:movie.title,
        cinema:cinema.name,
        show:show.startAt,
        seats:item.seats,
        ticketPrice:item.ticketPrice,
        total:item.total
      }   
      console.log(obj)
      display.push(obj)   
    }
    // console.log(all)
    // const movie = await Movie.findOne({title:req.params.title});
        res.status(200).json(display);
      }
  catch(err){
    res.status(400).json(err);
  }
})

  module.exports = router;