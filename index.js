const express =require('express');
const app=express();
const mongoose=require('mongoose')
const ejsMate=require('ejs-mate');
const path=require('path');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const {isLoggedIn}=require('./middleware');
const methodOverride=require('method-override')
//user
const User=require('./models/user');
const userRoutes=require('./routes/user');

// error handler
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');

// session and flash
const session=require('express-session');
const flash=require('connect-flash');

const dbUrl='mongodb://localhost:27017/web-player'
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
});

// to check connection (copied)

const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connectoin error!!"));
db.once("open",()=>{
    console.log("Database connected");
})


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use('/assets',express.static(path.join(__dirname,'assets')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(express.urlencoded({
    extended:true
}))

const sessionConfig={
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:(1000*60*60*24*7)
    }
}


app.use(session(sessionConfig));
app.use(flash());




// passport authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// flash middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})

//routes

app.use('',userRoutes);


app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/new',isLoggedIn,(req,res)=>{
    res.render('display');
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message="something went worng";
    res.status(statusCode).render('error',{err});
});

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})