const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const express= require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const connectDB = require("./config/Connection")
const Product = require("./models/UserModel");

const app=express();
connectDB();

app.use(cors());
app.use(express.json());

const PORT=process.env.PORT || 3004;

app.get("/products", async(req , res)=>{
    try{
    const limit = parseInt(req.query.limit) || 20;
    const category=req.query.category;

    const cursorCreateAt = req.query.cursorCreateAt;
    const cursorId = req.query.cursorId;

    const filter={};

    if(category){
        filter.category=category;
    }

    // applying curser pagination
    if(cursorCreateAt && cursorId){
        filter.$or=[
            {
                created_at:{
                    $lt: new Date(cursorCreateAt),
                },
            },
            {
                created_at : new Date(cursorCreateAt),
                _id:{
                    $lt : new mongoose.Types.ObjectId(cursorId)
                },
            }
        ];
    }

    // find new item first
    const products= await Product.find(filter)
      .sort({created_at:-1 , _id: -1})
      .limit(limit)

    // create next curser
    let nextCursor=null;

    if(products.length > 0){
        const last = products[products.length -1];

        nextCursor={
        cursorCreateAt : last.created_at.toISOString(),
        cursorId: last._id.toString()
       };
    }

    res.status(200).json({
        success : true,
        count : products.length,
        nextCursor,
        products
    });
}catch(error){
    console.error(error)

    res.status(500).json({
        success : false,
        message: "Server problem"
    });
};
});

app.listen(PORT , ()=>{
    console.log(`App are listen at ${PORT} port`)
})