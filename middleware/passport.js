
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const opts={}
const passport = require('passport')
const User = require("../model/user");
// const { options } = require('../routes/users');

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
opts.secretOrKey = 'satya'
passport.use(new JwtStrategy(opts, function(jwt_payload,done){
    console.log(jwt_payload)
    User.findOne({id:jwt_payload.id},function(err,user){
        if(err){
            return done(err,false)
        }
        if(user){
            // console.log(user)
            return done(null,user)
            
        }
        else{
            return done(null,false)
        }
    })
}))