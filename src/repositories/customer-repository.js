const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");

module.exports = {
	getAllCustomers: async () => {
		return await Customer.find({}, "-_id -__v");
	},
	addCustomer: async (data) => {
		var customer = new Customer(data);
		await customer.save();
	},
	authenticate: async (data) => {
		return await Customer.findOne({
			name: data.name,
			password: data.password,
		});
	},
	getCustomerById: async (id) => {
		return await Customer.findById(id);
	},
};
