var expect  = require('chai').expect;
var request = require('request');

describe('Common routes' , function() {
  var homeUrl = 'http://localhost:3000/'
  it('returns status 200 for homepage', function() {
    request(homeUrl, function(error, res, body) {
      expect(res.statusCode).to.equal(200);
    });
  });
});
