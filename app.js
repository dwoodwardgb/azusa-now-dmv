'use strict';

// modules
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const engine = require('ejs-mate');
const csrf = require('csurf');

const app = express();

// custom modules
const mydb = require('./db')(app);

// app config
const port = 3001;
const staticDirName = 'public';

app.use(helmet());
app.use(logger('dev')); // logger
app.use(bodyParser.json()); // json parser
app.use(bodyParser.urlencoded({ extended: true })); // url body parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, staticDirName))); // static dir

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// adds flash object to the response
app.use((req, res, next) => {
  if (!res.locals.flash) {
    res.locals.flash = {
      error: '',
      success: '',
      notice: ''
    };
  }

  next();
});

// for use with checkbox inputs
function checkboxToBool(checkbox) {
  return checkbox === 'on';
}

function parseCommunityGroup(group) {
  const ret = {};

  ret.name = group.name;
  ret.addrLine1 = group.addrLine1;
  ret.addrLine2 = group.addrLine2;
  ret.city = group.city;
  ret.state = group.state;
  ret.zip = group.zip;
  ret.leader = checkboxToBool(group.leader);

  ret.leadersWantToConnect = checkboxToBool(group.leadersWantToConnect);
  if (ret.leadersWantToConnect) {
    ret.contactForLeaders = (group.contactForLeaders === 'yes');
    if (!ret.contactForLeaders) {
      ret.leaderName = group.leaderName;
      ret.leaderEmail = group.leaderEmail;
      ret.leaderContactPreference = group.leaderContactPreference;
    }
  }

  console.log(ret);

  return ret;
}

function parsePersonFromRequest(req) {
  const person = {};

  person.firstName = req.body.firstName;
  person.lastName = req.body.lastName;
  person.email = req.body.email;
  person.phone = req.body.phone;
  person.churchName = req.body.churchName;
  person.churchCity = req.body.churchCity;
  person.churchState = req.body.churchState;

  if (!req.body.communityGroups) {
    person.communityGroups = [];
  } else {
    person.communityGroups = req.body.communityGroups.map(parseCommunityGroup);
  }

  if (!req.body.gender) {
    person.gender = '';
  } else {
    person.gender = req.body.gender;
  }

  person.goesToChurch = checkboxToBool(req.body.goesToChurch);
  person.partOfGroup = checkboxToBool(req.body.partOfGroup);
  person.wantsToConnect = checkboxToBool(req.body.wantsToConnect);

  if (!person.wantsToConnect) {
    person.contactPreference = '';
  } else {
    person.contactPreference = req.body.contactPreference;
  }

  return person;
}

const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

// routing
app.get('/azusa', csrfProtection, (req, res) => {
  const locals = { csrfToken: req.csrfToken() };
  res.render('form', locals);
});

app.post('/', csrfProtection, (req, res) => { // for saving data
  const person = parsePersonFromRequest(req);

  const collectionName = 'people';
  mydb((db) => {
    db.collection(collectionName).insertOne(person, (err) => {
      if (err) {
        console.error('error saving person:');
        console.error(req.body);
        console.error(err);
        res.locals.flash.error =
          'An error occurred while attempting to save your information :(';
      } else {
        res.locals.flash.success = 'Your info has been saved successfully!';
      }

      res.render('save', {});
    });
  }, () => {
    // error, not connected to database
    console.error('error saving person:');
    console.error(req.body);
    console.error('not connected to database');
    res.locals.flash.error = 'Your information could not be saved :(';
    res.render('save', {});
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => { // jshint ignore: line
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // jshint ignore: line
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: null
  });
});


// run app
app.listen(port, () => {
  console.log('running on %d', port);
});
