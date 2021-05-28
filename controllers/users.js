const User=require('../models/user')
const Playlist=require('../models/playlist');


module.exports.register=(req,res)=>{
    res.render('users/register');
}
 module.exports.createUser=async(req,res,next)=>{
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
}

module.exports.login=(req,res)=>{
    res.render('users/login');
}

module.exports.loggedIn=(req,res)=>{
    req.flash('success',"welcome back");
    const redirectUrl=req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout();
    req.flash("success","Logged Out");
    res.redirect('/');
}

module.exports.dashboard=async(req,res)=>{
    const playlist=await User.findById(req.params.id).populate('playlists');
    res.render("dashboard",{playlist});
}

module.exports.Form=(req,res)=>{
    res.render('new')
}

module.exports.upload=async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    const playlist=new Playlist(req.body.playlist);
    playlist.media_file=req.files.map(f=>({url:f.path,filename:f.filename}))
    user.playlists.push(playlist);
    await playlist.save();
    await user.save();
    console.log(playlist);
    res.redirect(`/dashboard/${user.id}`);
}

module.exports.deleteFile=async(req,res)=>{
    const {id,playlist_id}=req.params;
    User.findByIdAndUpdate(id,{$pull:{playlists:playlist_id}});
    await Playlist.findByIdAndDelete(playlist_id);
    res.redirect(`/dashboard/${id}`);
}