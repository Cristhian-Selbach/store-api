const mongoose = require("mongoose");
const Order = mongoose.model("Order");

module.exports = {
	getAllOrders: async() => {
		return await Order.find({}, "number createDate -_id")
			.populate("customer", "name -_id")
			.populate("items.product", "title -_id");
	},
	addOrder: async(data) => {
		var order = new Order(data);
		await order.save();
	},
};