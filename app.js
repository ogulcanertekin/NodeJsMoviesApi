const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const movie = require('./routes/movie');
const director = require('./routes/director');

const app = express();

//db connection

const db = require('./helper/db')();  //dahil ettikten sonra () calıstırıyor.

//Config
const config=require('./config');

//JWT Middleware
const verifyToken = require('./middleware/verify-token');

app.set('api_secret_key',config.api_secret_key); //global olarak kullanabilmek için;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());    //old -->body-parser -->post edilen json datasını almak için.
app.use(express.urlencoded({ extended: true })); //body parserin encoded url üzerinde kullanılmas için.
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/api',verifyToken);    //  api altındaki tüm routelar için Token dogrulaması middlewarei calıssın./api/movies dersek yalnızca o kısım icin de calısabilir.Hepsinde oturum dogrulaması yapılsın istiyoruz.

app.use('/api/movies', movie);      //1. parametre default 2. parametre-->movie.js
app.use('/api/directors', director); //director.js

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({error:{message: err.message, code:err.code }}); // error handling !
});

module.exports = app;
