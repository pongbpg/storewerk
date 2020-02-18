const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const moment = require('moment');
const mariadb = require('./mariadb');
const routers = require('./routes/index');
moment.locale('th');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//mariadb
app.use(mariadb);
app.use('/api', routers);

//html
app.use(express.static(publicPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
});

app.listen(port,  () => console.log('Server is up port:' + port));
