require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const reviewRouter = require('./routers/reviewRouter');
const feedRouter = require('./routers/feedRouter');
const reviewDetailsRouter = require('./routers/reviewDetailsRouter');
const likeRouter = require('./routers/likeRouter');
const commentRouter = require('./routers/commentRouter');
const PORT = process.env.PORT || 3000
const uri = process.env.mongoDBURL;

const app = express();
  
app.use(cors());

app.use(express.json());

app.use("/auth", authRouter);
app.use("/review", reviewRouter);
app.use("/feed", feedRouter)
app.use("/review-details", reviewDetailsRouter);
app.use("/likes",likeRouter)
app.use("/comment", commentRouter);
app.get('/',(req, res) => {
    res.render('index')
})

const start  = async() => {
    try{
        await mongoose.connect(uri)
        app.listen(PORT, ()=>{
            console.log(`server started on port ${PORT}`)
        })
    }catch(e){
        console.log(e);
    }
}
start();