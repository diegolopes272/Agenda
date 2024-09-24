
// README: Basic Agenda for contact inclusion or deletion
// npm -i to install all needed dependencies
// npm start to run
// Is required a CONNECTIONSTRING to access the database on Atlas Mongo


require('dotenv').config();

//app base
const express = require('express');
const app = express();


// database connection
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)       //using .env
    .then(() => {
        console.log('now is connects');
        app.emit('pronto'); //emit the event "pronto" to up the server
    })
    .catch(e => console.log(`fail:${e}`));


//sessions
const session = require('express-session');
const MongoStore = require('connect-mongo');

//flash messages
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');


//security
const helmet = require('helmet');
const csrf = require('csurf');

//middlewares
const { middlewareGlobal, checkCSRFError, csrfMiddleware } = require('./src/middlewares/middleware');


//use it all:
app.use(helmet());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));


//session configurations
const sessionOptions =  session({
    secret: 'asdhfajosdhfjhajdsf jdosfkj kjsdfj',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24*7, //time in ms - a week
        httpOnly: true
    }
});

//run the app
app.use(sessionOptions);

//flash messages
app.use(flash());

//views
app.set('views', path.resolve(__dirname, 'src', 'views'));  //path pra garantir path em diferentes ambientes
app.set('view engine', 'ejs'); //mais prox de html

//csrf
app.use(csrf());        

//middlewares
app.use(middlewareGlobal);  
app.use(checkCSRFError);
app.use(csrfMiddleware);

//routes 
app.use(routes);



// when the database is ready we can stand up the server
app.on('pronto', () => {

    console.log('connected on database');
    const porta = 30010;
    app.listen(porta, () => {
        console.log('server running on port:', porta);
        console.log(`access by http://localhost:${porta}`);
    });

});






