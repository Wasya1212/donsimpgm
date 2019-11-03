"use strict";

const path = require('path');
const fs = require('fs');
const http = require('http');

const Koa = require('koa');

const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const koaRouter = require('koa-router');
const cors = require('@koa/cors');

const errorhandler = require('./middleware/errorHandler');

const PAGE = fs.readFileSync(path.join(__dirname, 'dist/index.html'));

const router = new koaRouter();

router.get('/', ctx => {
  ctx.type = 'html';
  ctx.body = PAGE;
});

const app = new Koa();

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app.callback());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(errorhandler());

app.on('error', (err, ctx) => {
  console.error(err);
});

app.use(cors());
app.use(serve(path.resolve(__dirname, 'dist')));
app.use(koaBody({
  formidable: {
    uploadDir: './uploads',
    keepExtensions: true
  },
  multipart: true,
  urlencoded: true
}));

app.use(router.routes(), router.allowedMethods());

httpServer.listen(PORT, () => {
  console.log(`Server work on port ${PORT}...`);
});
