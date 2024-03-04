const path = require('path');
const express = require('express');
const morgan = require('morgan');
const route = require('./routes/index')
const { engine } = require('express-handlebars')
const bodyParser=require('body-parser');
const db = require('./config/db/index')


const app = express();
const port = 3000;

app.use(morgan('combined'));
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b,
    mul: (a, b) => a * b,
  }
}))
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'))

app.use(express.static(path.join(__dirname, 'public')))

// app.use(express.json());
// app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.render('home')
})

app.use(express.json());
app.use(express.urlencoded());

db.connect()
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

