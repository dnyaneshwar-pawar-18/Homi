const mongoose = require('mongoose');
const initData = require('./data')
const Listing = require('../models/listing')

const MONGO_URL = 'mongodb://127.0.0.1:27017/wander_lust';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log('connected successfully to db')
    })
    .catch((err) => {
        console.log(err)
    })

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '66bc904e16da4ebee80044ae'}));
    await Listing.insertMany(initData.data);
    console.log('Data was initialized')
}

initDB();