const bcrypt = require('bcrypt');
const userRepo = require('../repositories/userRepository');

function authenticate(username, password, cb) {
    userRepo.findByUsername(username, (err, user) => {
        if (err)
            return cb(err);

        if(!user)
            return cb(null, false);

        bcrypt.compare(password, user.password_hash, (err2, ok) => {
            if (err2)
                return cb(err2);

            if(!ok)
                return cb(null, false);

            cb(null, {user_id: user.user_id, username: user.username, role: user.role});
        });
    });
}

function getUserById(id, cb){
    userRepo.findById(id, cb);
}

function createUser(username, password, role, staffId, customerId, cb) {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err)
            return cb(err);

        userRepo.createUser({
            userName, password_hash: hash, role: role || 'customer',
            staff_id: staffId || null, customer_id: customerId || null
        }, cb);
    });
}

module.exports = { authenticate, getUserById, createUser };