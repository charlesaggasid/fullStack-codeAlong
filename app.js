const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override'); //important for EDIT
const Campground = require('./models/campground')

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

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({extended: true})) //Parsing the body after new post is created
app.use(methodOverride('_method')) //IMPORTANT FOR EDITS

//------------------------SAMPLE PAGE-----------------------
app.get('/', (req, res) => {
    // res.send('HELLO FROM YELPCAMP')
    res.render("home");
})

//------------------------CAMPGROUND INDEX PAGE-----------------------
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

//Order matters. No async/await for  CREATE A NEW CAMPGROUND
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground (req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})


//------------------------SHOW 1 CAMP-----------------------
// Somehow this code stay below, since we're looking for an ID. A post needs to be created first for we can look for the ID.
app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    console.log(campground)
    res.render('campgrounds/show', {campground})
})

//------------------------EDIT CAMPGROUND-----------------------
//Need to do methodOverride for PUT
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

//------------------------DELETE CAMPGROUND-----------------------
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})





//------------------------CREATE NEW CAMPGROUND-----------------------



//------------------------CREATE NEW CAMPGROUND RAW-----------------------
/*app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' });
    await camp.save();
    res.send(camp);
})*/





//------------------------listen to port-----------------------
app.listen(3000, () => {
    console.log('PORT 3000')
})