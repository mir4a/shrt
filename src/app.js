const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const csrf = require('koa-csrf');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const mongoose = require('mongoose');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');

const index = require('./routes/index');
const users = require('./routes/users');
const login = require('./routes/login');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/public')));

app.use(convert(views('views', {
  root: __dirname + '/views',
  default: 'jade',
})));

app.use(co.wrap(function* (ctx, next) {
  ctx.render = co.wrap(ctx.render);
  yield next();
}));

// DB connection
mongoose.connect(process.env.MONGODB_URI || 'localhost');

// Sessoion
app.keys = ['your-session-secret', 'another-session-secret'];
app.use(convert(session({
  store: new MongoStore(),
})));

// csrf
csrf(app);
app.use(convert(csrf.middleware));
// app.use(co.wrap(function* (ctx, next) {
//   ctx.render({
//     csrf: ctx.csrf,
//   });
// }));

// app.use(co.wrap(function* (ctx, next) {
//   var body = yield bodyparser(ctx);
//   try {
//     ctx.assertCSRF(body);
//   } catch (err) {
//     ctx.status = 403;
//     ctx.body = {
//       message: 'This CSRF token is invalid!',
//     };
//     return;
//   };
// }));

// authentication
require('./auth')
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

// logger

app.use(co.wrap(function* (ctx, next) {
  const start = new Date;
  yield next();
  const ms = new Date - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}));

router.use('/', index.routes(), index.allowedMethods());
router.use('/login', login.routes(), login.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());

// response

app.on('error', function (err, ctx) {
  log.error('server error', err, ctx);
});

module.exports = app;
