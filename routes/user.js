const express=require('express');
const passport = require('passport');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn}=require('../middleware');
const Playlist=require('../models/playlist');


router.get('/register',(req,res)=>{
    res.render('users/register');
})


router.post('/register',catchAsync(async(req,res,next)=>{
    try{
    const {email,name,username,password}=req.body;
    const user=new User({email,username,name});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash('success',"welcome");
        res.redirect('/');
    })
    }
    catch(e){
        res.redirect('/register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success',"welcome back");
    const redirectUrl=req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success","Logged Out");
    res.redirect('/');
})

router.get('/dashboard/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const playlist=await User.findById(req.params.id).populate('playlists');
    console.log(playlist);
    res.render("dashboard",{playlist});
}))

router.post('/dashboard/:id',catchAsync(async(req,res)=>{
    const user=await User.findById(req.params.id);
    const playlist=new Playlist(req.body.playlist);
    user.playlists.push(playlist);
    await playlist.save();
    await user.save();
    res.redirect('/dashboard');
}))


module.exports=router;