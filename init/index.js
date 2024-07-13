const mongoose = require("mongoose");
const initData=require("./data.js");
const Listing =  require("../models/listing.js");

let dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));


async function main() {
  await mongoose.connect(dbUrl);
}

const initDb= async()=>{
  initData.data=initData.data.map((obj)=>({...obj,Owner:'66919cfe4c09f94e46ee8e23',geometry:{
    type: 'Point',
    coordinates: [ 80.32175872474909, 26.46091363230995 ]
  }}))
       await Listing.insertMany(initData.data);
    //    console.log(initData);
       console.log("data was initialized");
}
initDb();