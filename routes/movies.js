
const express = require("express");
const router = express.Router()
const Showtime = require("../model/showtime");
const Location = require("../model/location");
const Movie = require("../model/movie");
const auth = require("../middleware/auth");
const Reservation = require("../model/reservation");

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

router.get('/:id',async(req,res)=>{

  try{
    const movie = await Movie.findById(req.params.id);
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
            img: movie.img,
            language:movie.language,
            genre:movie.genre
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

router.delete('/:id', auth.enhance,async(req,res)=>{

  try{
    
    const movie = await Movie.findById(req.params.id)
    const show =await Showtime.find({movieId:req.params.id})
    for (let item of show){
      const showtime = await Showtime.findById(item.id)
      const u2 = await showtime.delete()
      console.log('deleted show')
    }
    const reser =await Reservation.find({movieId:req.params.id})
    for (let item of reser){
      const reservation = await Reservation.findById(item.id)
      const u3 = await reservation.delete()
      console.log(reservation.movieId)
    }
    // const role = user.role
    // if (role=='guest') {return res.status(400).send("you cannot delete the user");}
    const u1 = await movie.delete()
    console.log(req.params.id)
    res.json('deleted movie')
    // res.status(200).json({
    //  data: u1,
    //  message: 'User has been deleted'
    // });
  }
  catch(err){
      res.send('error'+err)
  }
})

// Update a particular movie
router.patch('/:id', auth.enhance,async(req,res)=>{

  try{
   const movie = await Movie.findByIdAndUpdate({_id: req.params.id},
    {
      title: req.body.title,
      language:req.body.language,
      genre:req.body.genre,
      img:req.body.img
    })

    const u1 = await movie.save()
    const a = await Movie.findById({_id: req.params.id})
    res.json(a)
  }
  catch(err){
      res.send('error'+err)
  }
})   

  module.exports = router;