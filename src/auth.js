const passport = require('koa-passport');
const User = require('./models/user.js');

User.findOne({ username: 'test' }, function (err, testUser) {
  if (!testUser) {
    console.log('test user did not exist; creating test user...')
    testUser = new User({
      username: 'test',
      password: 'test'
    })
    testUser.save()
  }
})

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username, password: password }, done);
}))

const FacebookStrategy = require('passport-facebook').Strategy
passport.use(new FacebookStrategy({
    clientID: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user
    User.findOne({ facebook_id: profile.id }, done);
  }
))
