const express = require("express");
const router = express.Router()
const Showtime = require("../model/showtime");
const auth = require("../middleware/auth");
const Movie = require("../model/movie");
const Cinema = require("../model/cinema");
const Location = require("../model/location");

// Creating a cinema
router.post('/add',auth.enhance ,async (req, res) => {
    const cinema = new Cinema(req.body);
    try {
      const oldCinema = await Cinema.findOne( req.body );
  
      if (oldCinema) {
        return res.status(409).send("Cinema Already Exist. Please try again");
      }
      await cinema.save();
      res.status(201).send(cinema);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  router.get('/all',auth.enhance ,async(req,res)=>{

    try{
      const cinema = await Cinema.find();
      let details=[]
      // console.log(cinema)
      for (let item of cinema){
        const location = await Location.findById(item.city)
        let show={
          name:item.name,
          ticketPrice:item.ticketPrice,
          city:location.city,
          id:item.id
        }
        details.push(show)
        // console.log(show)
    }res.status(200).json(details);
  }
    catch(err){
        res.send('error'+err)
    }
})    

router.get('/:city',auth.verifyToken, async(req,res)=>{

  try{
    const cinema = await Cinema.find({city:req.params.city});
      res.json(cinema)
  }
  catch(err){
      res.send('error'+err)
  }
})

router.get('/:city/:title', auth.verifyToken,async(req,res)=>{

  try{
    const location = await Location.findOne({city:req.params.city})
    const movie = await Movie.findOne({title:req.params.title})
    const showtime = await Showtime.find({cityId:location.id,movieId:movie.id})
    details=[]
    for (let item of showtime){
      const cinema = await Cinema.findById(item.cinemaId);
      obj={
        name:cinema.name,
        id:item.cinemaId
      }
      details.push(obj)
    }
    
    res.status(200).json(details);
  }
  catch(err){
      res.send('error'+err)
  }
})
  module.exports = router;