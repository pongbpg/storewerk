const path = require('path');
const compression = require('compression');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const moment = require('moment');
const mariadb = require('./mariadb');
const routers = require('./routes/index');
moment.locale('th');

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));


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
