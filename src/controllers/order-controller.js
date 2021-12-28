const repository = require("../repositories/order-repository");
const guid = require("guid");
const authService = require("../services/auth-service");

module.exports = {

	getAllOrders: async(req,res) => {
		try{
			var orders = await repository.getAllOrders();
			res.status(200).send({
				"orders" : orders
			});	
		} 
		catch(e) {
			res.status(400).send("Error to listing orders " + e);
		}
	},
	addOrder: async(req,res) => {
		const token = req.body.token || req.query.token || req.headers["x-access-token"];
		const customerData = await authService.decodeToken(token);

		let order = {
			customer: customerData.id,
			number: guid.raw().substring(0,6),
			items: req.body.items
		};

		try{
			await repository.addOrder(order);
			res.status(201).send(`The order number: ${order.number}, customer: ${customerData.name} has been created.`);
		}
		catch(e) {
			res.status(400).send("An error ocurred " + e);
		}
	},
};