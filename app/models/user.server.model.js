const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        index: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        validate: [
            function (password) {
                return password.length >= 6;
            },
            'Password should be longer'
        ]
    },
    /*
     website:{
         type:String,
         get:function(url){
             if(!url){
                 return url;
             }else{
                 if(url.indexOf('http://') !==0 && url.indexOf('https://') !== 0){
                     url = 'http://'+url;
                 }
 
                 return url;
             }
         },
         set: function(url){
             if(!url){
                 return url;
             }else{
                 if(url.indexOf('http://')!==0 && url.indexOf('https://') !==0 ){
                     url = 'http://'+url;
                 }
 
                 return url;
             }
         }
     },
     role:{
         type:String,
         enum:['Admin', 'Owner', 'User']
     },
     */
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    },
});

UserSchema.pre('save', function (next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
})

UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
}

/*
UserSchema.statics.findOneByUsername = function(username, callback){
    this.findOne({username: new RegExp(username, 'i')},
    callback);
};
*/

UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
}

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var possibleUsername = username + (suffix || '');

    this.findOne({
        username: possibleUsername
    }, (err, user) => {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);

        }
    })
}


//Setter
UserSchema.virtual('fullName').set(function (fullName) {
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
})


//Getter 
UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
})


UserSchema.set('toJSON', { getters: true, virtuals: true });
mongoose.model('User', UserSchema);
