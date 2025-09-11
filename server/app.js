require('dotenv').config();

const path = require('path');
const express = require('express');
const morgan = require('morgan');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const pool = require('./config/db');

const app = express();

// --- Core & Middleware ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logging
app.use(morgan('dev'));


// Sessions
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    createDatabaseTable: true,
});

app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    },
}));

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Locals for views
app.locals.formatDateTime = (d) => {
    const dt = new Date(d);
    return isNaN(dt) ? '' : dt.toISOString().slice(0, 19).replace('T', ' ');
};

function posterCanonical(title) {
    const cleaned = String(title || '')
        .normalize('NFKD')
        .replace(/&/g, 'AND')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .trim()
        .toUpperCase();
    return encodeURIComponent(cleaned) + '.png';
}
app.locals.posterUrl = (film) => `/posters/${posterCanonical(film.title)}`;

app.use((req, res, next) => { res.locals.currentUser = req.session.user || null; next(); });
app.use((req, res, next) => { res.locals.nav = { current: req.path || '/' }; next(); });

// --- Routes ---
app.use('/auth',    require('./routes/auth'));
app.use('/',        require('./routes/index'));
app.use('/films',   require('./routes/films'));
app.use('/actors',  require('./routes/actors'));
app.use('/about',   require('./routes/about'));

// --- Error Handling ---
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Not Found',
        message: 'Page Not Found (404)',
        error: {},
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render('error', {
        title: 'Error',
        message: 'Something has gone wrong',
        error: process.env.NODE_ENV === 'development' ? { stack: err.stack } : {},
    });
});

// --- DB Ping on Startup ---
pool.getConnection((error, connection) => {
    if (error) {
        console.error('Database Connection Failed:', error.message);
        return;
    }

    connection.ping((pingError) => {
        if(pingError)
            console.error('Database Ping Failed:', pingError.message);

        else
            console.log('Database Connected Successfully');

        connection.release();
    });
});

// --- Start Server ---
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});