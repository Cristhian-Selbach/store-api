const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Customer",
		required: true,
	},
	number: {
		type: String,
		required: true,
	},
	createDate: {
		type: Date,
		required: true,
		default: Date.now,
	},
	status: {
		type: String,
		required: true,
		enum: ["created", "done"],
		default: "created",
	},
	items: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
			quantity: {
				type: Number,
				required: true,
				default: 1,
			},
			price: {
				type: Number,
				required: true,
			},
		},
	],
});

module.exports = mongoose.model("Order", schema);
