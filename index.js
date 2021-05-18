const express =require('express');
const app=express();
const mongoose=require('mongoose')
const path=require('path');
const passport=require('passport');
const LocalStrategy=require('passport-local');

//user
const User=require('./models/user');
const userRoutes=require('./routes/user');



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

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use('/assets',express.static(path.join(__dirname,'assets')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(express.urlencoded({
    extended:true
}))
// passport authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routes

app.use('',userRoutes);


app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/new',(req,res)=>{
    res.render('display');
})

// app.get('/dashboard/:id',(req,res,next)=>{
//     res.render("dashboard");
// })

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})