require("dotenv").config();
var jwt = require("jsonwebtoken");

module.exports = {
	generateToken: async (data) => {
		return jwt.sign(data, process.env.SALT_KEY, { expiresIn: "1d" });
	},

	decodeToken: async (token) => {
		return await jwt.verify(token, process.env.SALT_KEY);
	},

	authorize: (req, res, next) => {
		var token =
			req.body.token || req.query.token || req.headers["x-access-token"];

		if (!token) {
			res.status(401).end("Access Denied");
		}

		jwt.verify(token, process.env.SALT_KEY, (err) => {
			if (err) {
				res.status(400).send("Access Denied");
			} else next();
		});
	},

	isAdmin: (req, res, next) => {
		var token =
			req.body.token || req.query.token || req.headers["x-access-token"];

		if (!token) {
			res.status(401).end("Access Denied");
		}

		jwt.verify(token, process.env.SALT_KEY, (err, decoded) => {
			if (err) {
				res.status(400).send("An error ocurred -" + err);
			}

			if (decoded.roles.includes("admin")) {
				next();
			} else res.status(403).send("You need be a admin to access");
		});
	},
};
