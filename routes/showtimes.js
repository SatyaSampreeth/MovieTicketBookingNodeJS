
const express = require("express");
const router = express.Router()

const Showtime = require("../model/showtime");
const auth = require("../middleware/auth");
const Movie = require("../model/movie");
const Cinema = require("../model/cinema");
const Location = require("../model/location");
const passport = require('passport');
const cinema = require("../model/cinema");
const Reservation = require("../model/reservation");
require('../middleware/passport')

// Creating a movie 
router.post('/add', auth.enhance,async (req, res) => {
    const showtime = new Showtime(req.body);
    try {
      const oldShowtime = await Showtime.findOne( req.body );
  
      if (oldShowtime) {
        return res.status(409).send("Show Already Exist. Please try again");
      }
      await showtime.save();
      res.status(201).send(showtime);
    } catch (e) {
      res.status(400).send(e);
    }
  });


// Get details of all showtimes
router.get('/all', auth.enhance,async(req,res)=>{

  try{
    const showtime = await Showtime.find()
    let details=[]
      // console.log(cinema)
      for (let item of showtime){
        let location = await Location.findById(item.cityId)
        let movie = await Movie.findById(item.movieId)
        let cinema = await Cinema.findById(item.cinemaId)
        let show={
          startAt:item.startAt,
          title:movie.title,
          name:cinema.name,
          ticketPrice:cinema.ticketPrice,
          city:location.city
        }
        details.push(show)
        // console.log(show)
    }
    
    // const details={
    //   showtime:showtime,
    //   movie:movie,
    //   cinema:cinema
    // }
    res.json(details)
  }
  catch(err){
      res.send('error'+err)
  }
}) 

// Get details of all showtimes based on location testing
// router.get('/:city/:title', async(req,res)=>{

//   try{
//     const location = await Location.findOne({city:req.params.city})
//     const movie = await Movie.findOne({title:req.params.title});
//     const showtime = await Showtime.find({cityId:location.id,movieId:movie.id})
//     // const movie = await Movie.find(showtime.movieId)
//     // const cinema = await Cinema.find(showtime.cinemaId)
//     // const details={
//     //   showtime:showtime,
//     //   movie:movie,
//     //   cinema:cinema
//     // }
//     res.json(showtime)
//   }
//   catch(err){
//       res.send('error'+err)
//   }
// }) 

  // Get all details of a showtime
  router.get('/:id', auth.verifyToken,async(req,res)=>{

    try{
      const showtime = await Showtime.findById(req.params.id)
      const movie = await Movie.findById(showtime.movieId)
      const cinema = await Cinema.findById(showtime.cinemaId)
      const details={
        showtime:showtime,
        movie:movie,
        cinema:cinema
      }
      res.json(showtime)
    }
    catch(err){
        res.json('error'+err)
    }
  }) 


  router.get('/:city/:title',auth.verifyToken, async(req,res)=>{

    try{
      const location = await Location.findOne({city:req.params.city})
      const movie = await Movie.findOne({title:req.params.title});
      
      if (movie){
        const showtime = await Showtime.find({cityId:location.id,movieId:movie.id})
        let details=[]
        if(showtime.length>0){
          for (let shows of showtime){
            const cinema = await Cinema.findById(shows.cinemaId)
            let show={
              showtime:shows.startAt,
              cinema:cinema.name,
              id:shows.id
            }
            details.push(show)
            // console.log(shows)
          }
          // const details={
          //   shows:shows
          //   // location:cinema.city
          // }
          res.status(200).json(details);
        }
        else{res.json("No Shows");}
    }
    else{res.status(400).json("No Shows");}
      
    }
    catch(err){
      console.log(err);
    }
  })

  router.get('/:city/:title/:name', auth.verifyToken,async(req,res)=>{

    try{
      const location = await Location.findOne({city:req.params.city})
      const movie = await Movie.findOne({title:req.params.title});
      const cinema = await Cinema.findOne({name:req.params.name})
      if (cinema){
        const showtime = await Showtime.find({cityId:location.id,movieId:movie.id,cinemaId:cinema.id})
        let details=[]
        if(showtime.length>0){
          for (let shows of showtime){
            const cinema = await Cinema.findById(shows.cinemaId)
            let show={
              showtime:shows.startAt,
              // cinema:cinema.name,
              id:shows.id
            }
            details.push(show)
            // console.log(shows)
          }
          // const details={
          //   shows:shows
          //   // location:cinema.city
          // }
          res.status(200).json(details);
        }
        else{res.json("No Shows");}
    }
    else{res.status(400).json("No Shows");}
      
    }
    catch(err){
      console.log(err);
    }
  })

  router.post('/book',auth.verifyToken, async (req, res) => {
  
    try {
      const { id, seats} = req.body
      const showtime = await Showtime.findById(id)
      const movie = await Movie.findById(showtime.movieId)
      const cinema = await Cinema.findById(showtime.cinemaId)
      const location = await Location.findById(showtime.cityId)
      // console.log(seats.length)
      if (showtime.seatsAvailable<=0) {
        return res.json("Show Full. Please try again");
      }
      if (showtime.seatsAvailable<=seats.length){
        return res.json("Seats not available. Please try again");
      }
      // let l = seats.length
      let seat=showtime.seats
      // console.log(seat.length)
      let available= showtime.seatsAvailable 
      // console.log(seat)
      for (item of seats){
        r=item[0]
        c=item[1]
        if (seat.length<r){
          return res.json("out row")
        }
        console.log(seat[r].length)
        if (seat[r][c]==1){
          return res.json("Seats Already Booked. Please try again");
        }
        if (c>seat[r].length){
          return res.json('col out')
        }
        else{
          seat[r][c]=1 
          available-=1
        }
      }
      // console.log(seat)
      
      // res.status(200).json(seats);
      // showtime.seats=seat
      // showtime.seatsAvailable=available
      showtimee = await Showtime.findByIdAndUpdate(id, {seats:seat,seatsAvailable:available});
      // await showtime.save()
      const u1 = await showtimee.save()
      // cinema = Cinema.findOne(showtime.cinemaId)
      s = await Showtime.findById(id)
      // console.log(s)

      total=seats.length*cinema.ticketPrice
      let obj={
        seats:seats.length,
        showtime:showtime.startAt,
        cinema:cinema.name,
        movie:movie.title,
        city:location.city,
        ticketPrice:cinema.ticketPrice,
        total:total
      }
      let db={
        showId:showtime.id,
        seats:seats.length,
        ticketPrice:cinema.ticketPrice,
        total:total,
        movieId:movie.id,
        cinemaId:cinema.id,
        cityId:location.id
      }
      // const reservation = await Reservation.create({obj
      // });
      // console.log(obj)
      const reservation = new Reservation(db);
      await reservation.save()
      // console.log(showtime)
      // req
      // await showtime.save();
      res.status(200).json(obj);
    } catch (e) {
      res.status(400).json(e);
    }
  });

  module.exports = router;