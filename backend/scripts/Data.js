const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const Product= require("../models/userModel");
const connectDB = require("../config/Connection");

let categories=["Electronics","Clothing","Books","Sports","Home","Beauty","Toys","Grocery",];

console.log("Mongo url " , process.env.MONGODB_URL);
async function data(){
    try{
    await connectDB();

    await Product.deleteMany({});
    console.log("Old products deleted");

    const BATCH_SIZE=5000;

    for(let start=1 ; start<=200000 ; start+= BATCH_SIZE){
        let products=[];
        const now=new Date();
        for(let i=start ; i< start + BATCH_SIZE && i<=200000; i++){
        
        products.push({
            name: `Product ${i}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            price: Math.floor(Math.random() * 10000)+100,
            created_at: now,
            updated_at: now,
        })
    }
    await Product.insertMany(products)
    console.log(`Inserted ${products.length} products`);
    };
    console.log("All 200000 product inserted successfully");
    process.exit(0);
}catch(error){
    console.error("Inserting error :", error);
    process.exit(1);
}
}

data();