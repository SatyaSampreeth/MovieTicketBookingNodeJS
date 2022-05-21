
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

// Creating a Show
router.post('/add', auth.enhance,async (req, res) => {
    let seatsAvailablee=req.body.row*req.body.col
    let seatsList=[]
    let i=0 
    while(i<req.body.row){
      let j=0
      let l=[]
      while(j<req.body.col){
        l.push(0)
        j+=1
      }
      seatsList.push(l)
      i+=1
    }
    let obj={
      startAt:req.body.startAt,
      movieId:req.body.movieId,
      cityId:req.body.cityId,
      cinemaId:req.body.cinemaId,
      seats:seatsList,
      seatsAvailable:seatsAvailablee
    }
    const showtime = new Showtime(obj);
    try {
      const oldShowtime = await Showtime.findOne( obj );
  
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
          id:item.id,
          startAt:item.startAt,
          title:movie.title,
          name:cinema.name,
          ticketPrice:cinema.ticketPrice,
          city:location.city,
          seats:item.seats,
          seatsAvailable:item.seatsAvailable
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

// Get details of a show
router.get('/show/:id', async(req,res)=>{
  try{
    const showtime = await Showtime.findById(req.params.id)
    res.json(showtime)
  }
  catch(err){
      res.send('error'+err)
  }
}) 


// Get all details of a showtime
  router.get('/:id', auth.verifyToken,async(req,res)=>{

    try{
      const showtime = await Showtime.findById(req.params.id)
      const movie = await Movie.findById(showtime.movieId)
      const cinema = await Cinema.findById(showtime.cinemaId)
      const location = await Location.findById(showtime.cityId)
      const details={
        showtime:showtime,
        movie:movie,
        cinema:cinema
      }
      // total=seats.length*cinema.ticketPrice
      let obj={
        seats:showtime.seats,
        showtime:showtime.startAt,
        cinema:cinema.name,
        movie:movie.title,
        city:location.city,
        ticketPrice:cinema.ticketPrice,
        // total:total
      }
      console.log(showtime.movieId)
      res.json(obj)
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
              seatsAvailable:shows.seatsAvailable,
              img: cinema.img,
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
      const { id, seats, userId} = req.body
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
      // 
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
        total:total,
        movieimg:movie.img,
        cinemaimg:cinema.img
      }
      let db={
        showId:showtime.id,
        seats:seats.length,
        ticketPrice:cinema.ticketPrice,
        total:total,
        movieId:movie.id,
        cinemaId:cinema.id,
        cityId:location.id,
        userId:userId
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

  router.delete('/:id', auth.enhance,async(req,res)=>{

    try{
      
      const showtime = await Showtime.findById(req.params.id)
      // const role = user.role
      const reser =await Reservation.find({showId:req.params.id})
      for (let item of reser){
        const reservation = await Reservation.findById(item.id)
        const u3 = await reservation.delete()
        console.log(reservation.showId)
      }
      // if (role=='guest') {return res.status(400).send("you cannot delete the user");}
      const u1 = await showtime.delete()
      res.json('deleted showtime')
      // res.status(200).json({
      //  data: u1,
      //  message: 'User has been deleted'
      // });
    }
    catch(err){
        res.send('error'+err)
    }
  })

  // Update a particular show
router.patch('/:id', auth.enhance,async(req,res)=>{

  try{
   const show = await Showtime.findByIdAndUpdate({_id: req.params.id},
    {
      startAt: req.body.startAt,
      movieId:req.body.movieId,
      cityId:req.body.cityId,
      cinemaId:req.body.cinemaId,
      // seats:req.body.seats,
      // seatsAvailable:req.body.seatsAvailable,
    })
    const u1 = await show.save()
    const a = await Showtime.findById({_id: req.params.id})
    res.json(a)
  }
  catch(err){
      res.send('error'+err)
  }
})  

  module.exports = router;