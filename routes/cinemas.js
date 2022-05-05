const express = require("express");
const router = express.Router()
const Location = require("../model/location");
const Cinema = require("../model/cinema");
const auth = require("../middleware/auth");

// Creating a cinema
router.post('/add', async (req, res) => {
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

  router.get('/all', async(req,res)=>{

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

router.get('/:city', async(req,res)=>{

  try{
    const cinema = await Cinema.find({city:req.params.city});
      res.json(cinema)
  }
  catch(err){
      res.send('error'+err)
  }
})
  module.exports = router;