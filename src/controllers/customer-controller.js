require("dotenv").config();
const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/customer-repository");
const md5 = require("md5");
const emailService = require("../services/email-service");
const authService = require("../services/auth-service");

module.exports = {
	getAllCustomers: async (req, res) => {
		try {
			var customers = await repository.getAllCustomers();
			res.status(200).send({
				customers: customers,
			});
		} catch (e) {
			res.status(400).send("Error to listing customers " + e);
		}
	},
	addCustomer: async (req, res) => {
		let contract = new ValidationContract();

		contract.hasMinLen(
			req.body.name,
			3,
			"the name must be have at least 3 caracters"
		);
		contract.isEmail(req.body.email, "invalid email");
		contract.hasMinLen(
			req.body.password,
			6,
			"the pass must be have at least 6 caracters"
		);

		if (!contract.isValid()) {
			res.status(400).send(contract.errors()).end();
			return;
		}

		try {
			await repository.addCustomer({
				name: req.body.name,
				email: req.body.email,
				password: md5(req.body.password + process.env.SALT_KEY),
				roles: ["user"],
			});
			emailService.send(req.body.email, req.body.name);
			res.status(201).send(`The "${req.body.name}" has been registred.`);
		} catch (e) {
			res.status(400).send("An error ocurred " + e);
		}
	},
	authenticate: async (req, res) => {
		try {
			const customer = await repository.authenticate({
				name: req.body.name,
				password: md5(req.body.password + process.env.SALT_KEY),
			});

			if (!customer) {
				res.status(404).send("Invalid user or password");
			}

			const token = await authService.generateToken({
				id: customer._id,
				email: customer.email,
				name: customer.name,
				roles: customer.roles,
			});

			res.status(201).send({
				token: token,
				data: {
					email: customer.email,
					name: customer.name,
				},
			});
		} catch (e) {
			res.status(400).send("An error ocurred " + e);
		}
	},
	refreshToken: async (req, res) => {
		const token =
			req.body.token || req.query.token || req.headers["x-access-token"];
		const customerData = await authService.decodeToken(token);

		try {
			const customer = await repository.getCustomerById(customerData.id);

			if (!customer) {
				res.status(404).send("Customer not found");
			}

			const newToken = await authService.generateToken({
				id: customer._id,
				email: customer.email,
				name: customer.name,
				roles: customer.roles,
			});

			res.status(201).send({
				message: "token refreshed",
				"new token": newToken,
				data: {
					email: customer.email,
					name: customer.name,
				},
			});
		} catch (e) {
			res.status(400).send("An error ocurred - " + e);
		}
	},
};
