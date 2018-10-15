const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors')

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(cors());
const users = require('./routes/api/users');


//DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//Passport Middleware
app.use(passport.initialize());

//Passport Config JWT
require('./config/passport')(passport);

// Use Routes
app.use('/api/users',users);


const port = process.env.PORT || 5000;

app.listen(port , () => console.log(`server is running on ${port}`));

