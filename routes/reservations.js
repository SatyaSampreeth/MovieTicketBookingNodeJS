
const express = require("express");
const router = express.Router()
const Showtime = require("../model/showtime");
const Location = require("../model/location");
const Movie = require("../model/movie");
const auth = require("../middleware/auth");
const Reservation = require("../model/reservation");

// Creating a movie 
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

  router.get('/all', async(req,res)=>{

    try{
      const reservation = await Reservation.find();
    res.json(reservation)
    }
    catch(err){
        res.status(400).json(err);
    }
})   

//get movies based on id
router.get('/:id', async(req,res)=>{

  try{
    const reservation = await Reservation.findById(req.params.id)
    // const movie = await Movie.findOne({title:req.params.title});
        res.status(200).json(reservation);
      }
  catch(err){
    res.status(400).json(err);
  }
})

  module.exports = router;