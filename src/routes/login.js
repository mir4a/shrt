var router = require('koa-router')();

router.get('/', function (ctx, next) {
  ctx.render('login', {
    title: 'Login Page',
  });
});

module.exports = router;
