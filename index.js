var express = require('express');
var app = express();
var user = require('./controllers/user-controller');
let animal = require('./controllers/animal-controller')
var sequelize = require('./db');
var bodyParser = require('body-parser');
require('dotenv').config();

sequelize.sync();

app.use(bodyParser.json());

app.use(require('./middleware/headers'));

app.use('/user', user);

app.use('/animal', animal)

app.listen(3000, function(){
  console.log('App is listening on port 3000');
})
