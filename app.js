if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require('express'); // #1
const app = express();
const mongoose = require('mongoose'); // #2
const path = require('path') // #4
const methodOverride = require('method-override') //#5
const ExpressError = require('./utils/ExpressError.js') // /#8
const ejsMate = require('ejs-mate'); // #6
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');




// route #1
// app.get('/', (req, res) => {
//     res.send('Hi, I am root')
// })



app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));


const dbURL = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on('error', ()=>{
    console.log('Error in mongo session store', err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.get('/demouser', async (req, res) => {
    const fakeUser = new User({
        email: "student@gmail.com",
        username: 'sigma-student',
    })

    const registeredUser = await User.register(fakeUser, 'sigma@123');
    res.send(registeredUser);
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);


const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews/', reviewsRouter);
app.use('/', userRouter);





main()
    .then(() => {
        console.log('connected successfully to db')
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(dbURL);
}


// route #11 : Middleware
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found!'))
})

// route #10 : Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrond!" } = err;
    res.status(statusCode).render('error.ejs', { err })
})

app.listen(5000, () => {
    console.log(`Server is listening on port http://localhost:5000/listings`)
})


/*
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
    secret: 'GhostByte$1138',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// Middleware
app.use(express.urlencoded({ extended: true })); // Make sure this is placed correctly
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

const listings = require('./routes/listing.js');
const reviews = require('./routes/reviews.js');

app.use('/listings', listings);
app.use('/listings/:id/reviews/', reviews);

const MONGO_URL = 'mongodb://127.0.0.1:27017/wander_lust';

main().then(() => {
    console.log('connected successfully to db');
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.listen(5000, () => {
    console.log('Server is listening on port http://localhost:5000');
});


*/