const express = require("express");
const app = express();
const cors = require('cors')
// var coreOptions={
//     // origin:"http://localhost:4200"
//     origin:"http://moviebooking.s3-website.ap-south-1.amazonaws.com/"
// }
// data base connection
const mongoose = require('mongoose')
const url = 'mongodb://localhost/AuthDB'
var bodyParser = require('body-parser');
mongoose.connect(url)
const con = mongoose.connection
con.on('open',()=>{
    console.log('connected')
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())
app.use('/profle',express.static('upload/images'))

const passport = require('passport')
app.use(passport.initialize())
require('./middleware/passport')
app.get('/book',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.send('hello world')
})

//Routes
const userRouter = require('./routes/users')
app.use('/',userRouter)
const locationRouter = require('./routes/locations');
app.use('/location',locationRouter)
const movieRouter = require('./routes/movies');
app.use('/movie',movieRouter)
const cinemaRouter = require('./routes/cinemas')
app.use('/cinema',cinemaRouter)
const showtimeRouter = require('./routes/showtimes');
app.use('/showtime',showtimeRouter)
const reservationRouter = require('./routes/reservations');
app.use('/reservation',reservationRouter)

// server listening 
app.listen(9000,()=>{
    console.log('server started')
})