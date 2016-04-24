'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

module.exports = (app) => {

  // set the connection url based on the evironment
  let dbName = 'azusaNowDMV';
  if (app.get('env') === 'production') {
    dbName += 'Production';
  } else {
    dbName += 'Development';
  }
  const url = 'mongodb://localhost/' + dbName;

  // will be set when a successful connection is made
  let _db;

  // connect to the database
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log('connected to db: %s', url);
    _db = db;
  });

  /*
   * If connected, call the first callback with the db passed as an argument,
   * if not connected, call the second callback
   */
  return (connectedCb, disconnectedCb) => {
    if (_db) {
      connectedCb(_db);
    } else {
      disconnectedCb();
    }
  };
};
