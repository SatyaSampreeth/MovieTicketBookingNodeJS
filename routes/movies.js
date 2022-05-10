
const express = require("express");
const router = express.Router()
const Showtime = require("../model/showtime");
const Location = require("../model/location");
const Movie = require("../model/movie");
const auth = require("../middleware/auth");

// Creating a movie 
router.post('/add',auth.enhance, async (req, res) => {
    const movie = new Movie(req.body);
    try {
      const oldMovie = await Movie.findOne( req.body );
  
      if (oldMovie) {
        return res.status(409).send("Movie Already Exist. Please try again");
      }
      await movie.save();
      res.status(201).send(movie);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  router.get('/all', auth.enhance,async(req,res)=>{

    try{
      const movie = await Movie.find();
        res.json(movie)
    }
    catch(err){
        res.send('error'+err)
    }
})   

//get movies based on location
router.get('/:city', auth.verifyToken,async(req,res)=>{

  try{
    const location = await Location.findOne({city:req.params.city})
    // const movie = await Movie.findOne({title:req.params.title});
    
    if (location){
      const showtime = await Showtime.find({cityId:location.id})
      let details=[]
      if(showtime.length>0){
        for (let shows of showtime){
          const movie = await Movie.findById(shows.movieId)
          let show={
            id:movie.id,
            title:movie.title,
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

  module.exports = router;