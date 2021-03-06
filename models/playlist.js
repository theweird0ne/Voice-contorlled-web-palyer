const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const playlistSchema=new Schema({
    title:String,
    media_file:[
        {
            url:String,
            filename:String
        }
    ],
});

module.exports=mongoose.model("Playlist",playlistSchema);