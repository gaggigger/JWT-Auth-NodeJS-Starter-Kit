var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var jwt      = require('jsonwebtoken');
var config   = require('../config/config');

var UserSchema = mongoose.Schema({
	username: { type:String, require:true, unique: true },
	email: { type:String, require:true, unique: true },
	password: { type:String, require:true,select: false },
	admin: { type:Boolean, default: false }
});

UserSchema.pre('save', function (next) {

	var user = this;

	if(user.isModified('password')){
		user.password = bcrypt.hashSync(user.password);
	}

	next();
});

UserSchema.methods.checkPassword = function (hash, done) {

	var {username, password} = this;

	bcrypt.compare(hash, password, function (err, res) {
		if(res) return done(null, true );
		return done('Wrong Password!');
	});
};

UserSchema.methods.auth = function (done) {

	var user = this;

	var token = jwt.sign({
		username: user.username,
		admin: user.admin
	}, config.secret, {expiresIn: 86400 });

	done(null, {
		expire: Date.now() + 86400,
		message: 'Authorization token',
		token: token
	});
};


module.exports = mongoose.model('User', UserSchema, 'users');
