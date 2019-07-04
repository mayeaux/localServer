var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var serveIndex = require('serve-index')


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
const fs = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', async function(req, res){

  const directory = '../uploads/';

  var things = fs.readdirSync(directory);

  things.sort(function(a, b) {

    return fs.statSync(directory + a).mtime.getTime() -
      fs.statSync(directory + b).mtime.getTime();
  });

  things.reverse();

  let items = [];

  for(const thing of things){

    console.log(fs.lstatSync(directory + thing).isFile());
    console.log(fs.lstatSync(directory + thing).isDirectory());

    var obj = {
      title: thing,
      isFile: fs.lstatSync(directory + thing).isFile(),
      isDirectory: fs.lstatSync(directory + thing).isDirectory()
    };

    items.push(obj);


    // console.log(thing);


    // var data = fs.statSync(directory + thing);



    // console.log(data);
  }

  // console.log(things);


  res.render('index', {
    title: 'Express',
    things : items
  });
});

app.use('/uploads', express.static('../uploads'));


app.use('/index', express.static('../uploads'), serveIndex('../uploads', {'icons': true}))


app.use('/index', express.static(path.join(__dirname, 'public')));


// app.use('/', routes);
app.use('/users', users);

app.get('/uploads/*', async function(req, res){
  console.log(req.path);
  // res.send('hello');

  const directory = '..' + req.path;

  var things = fs.readdirSync(directory);

  things.sort(function(a, b) {

    return fs.statSync(directory + a).mtime.getTime() -
      fs.statSync(directory + b).mtime.getTime();
  });

  things.reverse();

  let items = [];

  for(const thing of things){

    console.log(fs.lstatSync(directory + thing).isFile());
    console.log(fs.lstatSync(directory + thing).isDirectory());

    var obj = {
      title: thing,
      isFile: fs.lstatSync(directory + thing).isFile(),
      isDirectory: fs.lstatSync(directory + thing).isDirectory()
    };

    items.push(obj);


    // console.log(thing);


    // var data = fs.statSync(directory + thing);



    // console.log(data);
  }

  // console.log(things);


  res.render('index1', {
    title: 'Express',
    things : items,
    reqPath: req.path
  });

});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// // production error handler
// // no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
