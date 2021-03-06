var config = require('../config/config');

module.exports = function(User){

	return {
		authenticate:function(req, res) {
			var { username, password } = req.body;
			if(!name || !name.length ) {
				return res.status(400).json({
					success: false,
					message: 'No username provided'
				})
			};
			User.findOne({
				username: username
			}, function(err, user) {
				if (err) {
					return res.status(500).json({
						success: false,
						err
					});
				};

				if (!user) {
					return res.json({
						success: false,
						message: 'Authentication failed. User not found.'
					});
				};

				user.checkPassword( password, function (err, check) {
					if(err) return res.status(403).json({
						success: false,
						message: err
					});

					user.auth(function (err, token) {
						return res.json(token);
					});

				});

			});
		},

	}; //return

};
