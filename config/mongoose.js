const config = require('./config');
const mongoose = require('mongoose');


module.exports = function(){
    mongoose.Promise = global.Promise;

    const db = mongoose.connect((config.db), {
        useMongoClient:true
    });
    require('../app/models/user.server.model');

    return db;
}