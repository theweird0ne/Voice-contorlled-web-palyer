const express=require('express');
const passport = require('passport');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn}=require('../middleware');
const Playlist=require('../models/playlist');
const methodOverride=require('method-override')
const users=require('../controllers/users');

const multer=require('multer');
const {storage}=require('../cloudinary')
const upload=multer({storage});

router.route('/register')
        .get(users.register)
        .post(catchAsync(users.createUser));


router.route('/login')
        .get(users.login)
        .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loggedIn)

router.get('/logout',users.logout);

router.get('/dashboard/:id',isLoggedIn,catchAsync(users.dashboard));

router.get('/new',isLoggedIn,users.Form);

router.post('/dashboard/:id',upload.array('image'),catchAsync(users.upload));

router.delete('/dashboard/:id/playlists/:playlist_id',catchAsync(users.deleteFile))

router.get('/dashboard/:id/playlists/:playlist_id/player' ,catchAsync(async(req,res,next)=>{
        const playlist=await Playlist.findById(req.params.playlist_id);
        console.log(playlist)
        res.render('display',{playlist});
}))


module.exports=router;