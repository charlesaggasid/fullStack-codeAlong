//Made SEEDS dir, then made the files

//copied from app.js
//here you'll see REQUIRE, it's the same thing as IMPORT in JAVA programming
const mongoose = require('mongoose')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    // useNewUrlParser: true,
    // createIndexes: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)]

//start by removing everything from the DB
const seedDB = async () => {
    await Campground.deleteMany({})
    //test to make sure we're connected to DB
    /*const c = new Campground({title: 'purple field'})
    await c.save()*/

    //Seed logic
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const camp= new Campground({
            location: `${cities[random1000].city},${ cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }

}

//execute func
seedDB().then(() => {
    mongoose.connection.close()
});