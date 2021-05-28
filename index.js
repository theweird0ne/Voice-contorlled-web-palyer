if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const express =require('express');
const app=express();
const mongoose=require('mongoose')
const ejsMate=require('ejs-mate');
const path=require('path');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const {isLoggedIn}=require('./middleware');
const methodOverride=require('method-override')
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
// const {MongoStore}=require('connect-mongo');

//user
const User=require('./models/user');
const userRoutes=require('./routes/user');

// error handler
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');

// session and flash
const session=require('express-session');
const flash=require('connect-flash');
// const { contentSecurityPolicy } = require('helmet');

// const MongoDBStore=require('connect-mongo')(session);
// const dbUrl='mongodb://localhost:27017/web-player'
const dbUrl=process.env.DB_URL
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

app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use('/assets',express.static(path.join(__dirname,'assets')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(express.urlencoded({
    extended:true
}))
app.use(mongoSanitize({
    replaceWith:'_'
}))

// const store=new MongoDBStore.create({
//     url:dbUrl,
//     secret:'secret',
//     touchAfter:24*60*60,
// })

// store.on("errror",function(e){
//     console.log("SESSION STORE ERROR");
// })

const sessionConfig={
    // store,
    name:'session',
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:(1000*60*60*24*7)
    }
}


app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy:false}));



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

app.get('/play',(req,res)=>{
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