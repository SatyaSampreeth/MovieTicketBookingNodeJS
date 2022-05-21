
const express = require("express");
const router = express.Router()
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: './upload/images',

  filename: function(req,file,cb){
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const fileFilter = (req,file,cb)=>{
  // if (file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg'){
  //   cb(null,true)
  // }
  // else{
  //   cb(null,false)
  // }
  cb(null,true)
}

const upload = multer({storage:storage,
// limits:{
//   fileSize:1024 * 1024 * 10000
// },
// fileFilter: fileFilter
})

const Location = require("../model/location");
const auth = require("../middleware/auth");
const Showtime = require("../model/showtime");
const Cinema = require("../model/cinema");
const Reservation = require("../model/reservation");

// Creating a movie 
router.post('/add',auth.enhance,upload.single('img') ,async (req, res) => {
    const location = new Location(req.body);
    try {
      const oldLocation = await Location.findOne( req.body );
  
      if (oldLocation) {
        return res.status(409).send("Location Already Exist. Please try again");
      }
      await location.save();

      res.status(201).send(location);
    } catch (e) {
      res.status(400).send(req.file);
    }
  });

  router.post('/loc',upload.single('profile'), async (req, res) => {
    const location = new Location({
      city: req.body.city,
      img: req.file.path
    })
    console.log(location.img)
    try {
      // const oldLocation = await Location.findOne( req.body.city );
  
      // if (oldLocation) {
      //   return res.status(409).send("Location Already Exist. Please try again");
      // }
      await location.save();
      res.json({
        success: 1,
        profile_url: `http://localhost:4000/profile/${req.file.filename}`
    })
      // res.status(201).json(location);
    } catch (e) {
      res.status(400).send(e);
    }
  }); 

  router.get('/all',async(req,res)=>{

    try{
      const location = await Location.find();
        res.json(location)
    }
    catch(err){
        res.send('error'+err)
    }
}) 

router.get('/:id',async(req,res)=>{

  try{
    const location = await Location.findById(req.params.id);
      res.json(location)
  }
  catch(err){
      res.send('error'+err)
  }
}) 

router.delete('/:id', auth.enhance,async(req,res)=>{

  try{
    
    const location = await Location.findById(req.params.id)
    const cinema =await Cinema.find({city:req.params.id})
    for (let item of cinema){
      const c = await Cinema.findById(item.id)
      const show =await Showtime.find({cinemaId:c.id})
      for (let item1 of show){
        const showtime = await Showtime.findById(item1.id)
        const u2 = await showtime.delete()
        console.log('deleted show')
      }
      const u3 = await c.delete()
      console.log('deleted cinema')
    }
    const reser =await Reservation.find({cityId:req.params.id})
    for (let item of reser){
      const reservation = await Reservation.findById(item.id)
      const u3 = await reservation.delete()
      console.log(reservation.cityId)
    }
    // const role = user.role
    // if (role=='guest') {return res.status(400).send("you cannot delete the user");}
    const u1 = await location.delete()
    console.log('deleted location')
    res.json('deleted location')
    // res.status(200).json({
    //  data: u1,
    //  message: 'User has been deleted'
    // });
  }
  catch(err){
      res.send('error'+err)
  }
})

// Update a particular location
router.patch('/:id', auth.enhance,async(req,res)=>{

  try{

   const location = await Location.findByIdAndUpdate({_id: req.params.id},{city: req.body.city,})
    
    // const user = await User.findById(req.params.id)
    //     user.email = req.body.email
    const u1 = await location.save()
    const a = await Location.findById({_id: req.params.id})
    res.json(a)
  }
  catch(err){
      res.send('error'+err)
  }
})   

  module.exports = router;