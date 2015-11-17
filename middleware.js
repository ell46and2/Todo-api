module.exports = function(db) {
	return {
		requireAuthentication: function (req, res, next) {
			// set token equal to the Auth set in the header 
			var token = req.get('Auth');
			
			db.user.findByToken(token).then(function(user) {
				req.user = user;
				next();
			}, function() {
				res.status(401).send();
			});
		}	
	};	
};