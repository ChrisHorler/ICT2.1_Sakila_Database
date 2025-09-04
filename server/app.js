const express = require('express');
const path = require("node:path");

const app = express();
const port = 3000;
const siteRouter = require('./routes/site');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', siteRouter);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

