require('dotenv').config();

const bcrypt = require('bcrypt');
const pool = require('../config/db');
const userRepo = require('../repositories/userRepository');

const [,, username, password, role='admin'] = process.argv;

if(!username || !password) {
    console.log('Usage: node scripts/seedUser.js <username> <password> [role]');
    process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
    if (err)
        throw err;

    userRepo.createUser({
        username, password_hash: hash, role }, (e, id) => {
        if(e)
            throw e;

        console.log('User created with id:', id);
        pool.end();
    });
});