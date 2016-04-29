'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let dbName = 'azusaNowDMVProduction';
const url = 'mongodb://localhost/' + dbName;

// connect to the database
MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);

  db.collection('people').find({}).toArray((err, people) => {
    assert.equal(null, err);
    people.forEach((p) => {
      console.log('%s %s | gender: %s | %s %s', p.firstName, p.lastName, p.gender, p.email, p.phone);
      console.log('church: %s | %s, %s', p.churchName, p.churchCity, p.churchState);
      console.log('wants to connect? %s | contact preference: %s', p.wantsToConnect, p.contactPreference);
      console.log('went to event? %s', p.attendedEvent);
      console.log('testimony:');
      console.log(p.testimony);
      console.log('community groups:');
      p.communityGroups.forEach((g) => {
        console.log('    %s | %s %s %s %s, %s', g.name, g.addrLine1, g.addrLine2, g.city, g.state, g.zip);
        console.log('    is leader? %s', g.leader);
        console.log('    leaders want to connect? %s', g.leadersWantToConnect);
        if (g.leadersWantToConnect) {
          console.log('    contact this person for leader? %s', g.contactForLeaders);
          if (!g.contactForLeaders) {
            console.log('    contact: %s | %s %s contact preference: %s', g.leaderName, g.leaderEmail, g.leaderPhone, g.leaderContactPreference);
          }
        }
      });

      console.log();
      console.log('--------------------------------------------------------');
      console.log();
    });
  });
});
