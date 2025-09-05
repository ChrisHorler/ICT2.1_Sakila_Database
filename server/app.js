require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
const pool = require('./config/db');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.formatDateTime = (d) =>
    new Date(d).toISOString().slice(0, 19).replace('T', ' ');

app.use('/', require('./routes/index'));

app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Not Found',
        message: 'Page Not Found (404)',
        error: {}
    });
});

app.use((err, req, res) => {
    Console.error(err);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Something has gone wrong',

        error: process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}
    });
});

pool.getConnection((error, connection) => {
    if (error) {
        console.error('Database Connection Failed:', error.message);
        return;
    }

    conn.ping((pingError) => {
        if (pingError)
            console.error('Database Ping Failed:', pingError.message);
        else
            console.log('Database Connected Successfully');
        connection.release();
    })
})




const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})