const mongoose = require ('mongoose')
const intData = require('./data.js')
const Listing = require('../models/listening.js')
const url ="mongodb://127.0.0.1:27017/wanderlust";



async function main(){
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
}

main().then(()=>{
    console.log('Connection Successful');
}).catch((err)=>{
    console.log('Connection Failed', err);
});


const initData= async ()=>{
    await Listing.deleteMany({});

initData.data = (initData.data || []).map((obj) => ({ ...obj, owner: '68d4524893a070c9900b95be' }));
    await Listing.insertMany(intData.data)
    console.log("Data Was inserted")

}

initData();