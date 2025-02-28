const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "67c19cfd3844fed8409a2a51"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};


initDB()
.then(() => {
    console.log("Database initialization completed successfully.");
})
.catch((error) => {
    console.error("Error during database initialization:", error);
});