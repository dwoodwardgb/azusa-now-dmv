'use strict';

// modules
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// custom modules
const mydb = require('./db')(app);

// app config
const port = 3000;
const staticDirName = 'public';

app.use(logger('dev')); // logger
app.use(bodyParser.urlencoded({ extended: true })); // url body parser
app.use(express.static(path.join(__dirname, staticDirName))); // static dir

// for use with checkbox inputs
function checkboxToBool(obj, propName) {
  if (obj[propName] === 'on') {
    obj[propName] = true;
  } else {
    obj[propName] = false;
  }
}

// routing
app.post('/', (req, res, next) => { // for saving data
  console.log(req.params);
  console.log(req.body);

  // add the community groups field if missing
  if (!req.body.communityGroups) {
    req.body.communityGroups = [];
  }

  checkboxToBool(req.body, 'goesToChurch');
  checkboxToBool(req.body, 'partOfGroup');
  req.body.communityGroups.forEach(
    (group) => checkboxToBool(group, 'leader'));

  res.send('success!');

  // TODO ???

  // const collectionName = 'people';
  // mydb((db) => {
  //   db.collection(collectionName).insertOne(req.body, (err) => {
  //     if (err) next(err);
  //     else res.send('success!');
  //   });
  // }, () => {
  //   // error, not connected to database
  //   next();
  // });

});

// run app
app.listen(port, () => {
  console.log('running on %d', port);
});
