const mongoose=require("mongoose");

const itemProduct=new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    category: {
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
},
{
    versionKey: false
}

);

itemProduct.index({created_at:-1 , _id: -1});
itemProduct.index({category: 1 , created_at:-1 , _id: -1})

module.exports=mongoose.model("Product" , itemProduct);