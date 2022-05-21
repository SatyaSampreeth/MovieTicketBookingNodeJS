const express = require("express");
const router = express.Router()
const Showtime = require("../model/showtime");
const auth = require("../middleware/auth");
const Movie = require("../model/movie");
const Cinema = require("../model/cinema");
const Location = require("../model/location");
const Reservation = require("../model/reservation");
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
          id:item.id,
          img:item.img
        }
        details.push(show)
        // console.log(show)
    }res.status(200).json(details);
  }
    catch(err){
        res.send('error'+err)
    }
})    

router.get('/cinema/:id',async(req,res)=>{

  try{
    const cinema = await Cinema.findById(req.params.id);
      res.json(cinema)
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
        id:item.cinemaId,
        img:cinema.img,
        ticketPrice:cinema.ticketPrice
      }
      details.push(obj)
    }
    
    res.status(200).json(details);
  }
  catch(err){
      res.send('error'+err)
  }
})

router.delete('/:id', auth.enhance,async(req,res)=>{

  try{
    
    const cinema = await Cinema.findById(req.params.id)
    const show =await Showtime.find({cinemaId:req.params.id})
    for (let item of show){
      const showtime = await Showtime.findById(item.id)
      const u2 = await showtime.delete()
      console.log('deleted show')
    }
    const reser =await Reservation.find({cinemaId:req.params.id})
    for (let item of reser){
      const reservation = await Reservation.findById(item.id)
      const u3 = await reservation.delete()
      console.log(reservation.cinemaId)
    }
    // const role = user.role
    // if (role=='guest') {return res.status(400).send("you cannot delete the user");}
    const u1 = await cinema.delete()
    // console.log(cinema.id)
    res.status(201).json('deleted theatre');
    // res.status(200).json({
    //  data: u1,
    //  message: 'User has been deleted'
    // });
  }
  catch(err){
      res.send('error'+err)
  }
})

// Update a particular cinema
router.patch('/:id', auth.enhance,async(req,res)=>{

  try{
   const cinema = await Cinema.findByIdAndUpdate({_id: req.params.id},
    {
      name: req.body.name,
      ticketPrice:req.body.ticketPrice,
      img:req.body.img,
      city:req.body.cityId
    })
    const u1 = await cinema.save()
    const a = await Cinema.findById({_id: req.params.id})
    res.json(a)
  }
  catch(err){
      res.send('error'+err)
  }
})  

  module.exports = router;