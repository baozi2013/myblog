/**
 * Created by test on 10/19/16.
 */var request = require('supertest');
var app = require('../app.js');

describe('GET /helloworld', function() {
  it('respond with hello world', function(done) {
    request(app).get('/helloworld').expect('hello world', done);
  });
});