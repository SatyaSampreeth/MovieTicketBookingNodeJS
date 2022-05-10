
const express = require("express");
const router = express.Router()

const Location = require("../model/location");
const auth = require("../middleware/auth");

// Creating a movie 
router.post('/add',auth.enhance, async (req, res) => {
    const location = new Location(req.body);
    try {
      const oldLocation = await Location.findOne( req.body );
  
      if (oldLocation) {
        return res.status(409).send("Location Already Exist. Please try again");
      }
      await location.save();

      res.status(201).send(location);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  router.get('/all',auth.verifyToken,async(req,res)=>{

    try{
      const location = await Location.find();
        res.json(location)
    }
    catch(err){
        res.send('error'+err)
    }
})    

  module.exports = router;