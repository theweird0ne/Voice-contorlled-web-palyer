const express =require('express');
const app=express();
const path=require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use('/assets',express.static(path.join(__dirname,'assets')));

app.get('/new',(req,res)=>{
    res.render('display');
})



app.listen(3000,()=>{
    console.log("Serving on port 3000");
})