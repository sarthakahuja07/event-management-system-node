const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	// IF A USER EXISTS, THEN VERIFY TOKEN
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				console.log(err);
				return res.status(403).json("Token is not valid!");
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json("You are not authenticated!");
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	// IF A USER IS AUTHORIZED TO PERFORM SOME ACTION, THEN VERIFY TOKEN , like viewing his own profile
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id) {
			next();
		} else {
			res.status(403).json("You are not alowed to do that!");
		}
	});
};

module.exports = {
	verifyToken,
	verifyTokenAndAuthorization
};
