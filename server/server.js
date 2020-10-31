const path = require('path');
const compression = require('compression');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const mariadb = require('./mariadb');
const routers = require('./routes/index');
const jwt = require('jsonwebtoken')
moment.locale('th');

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

// Set up a whitelist and check against it:
var whitelist = ['http://localhost:8080', 'https://storewerk.me']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// Then pass them to cors:
// app.use(cors());

//mariadb
app.use(mariadb);
app.use('/api', routers);

//html
app.use(compression());
app.use(express.static(publicPath));
app.get('*.js', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});

app.get('*.css', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    next();
});
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
});
app.listen(port, () => console.log('Server is up port:' + port));
