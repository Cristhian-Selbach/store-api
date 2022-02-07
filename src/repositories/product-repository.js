const mongoose = require("mongoose");
const Product = mongoose.model("Product");

module.exports = {
	getAllProducts: async () => {
		return await Product.find({ active: true }, "title price slug -_id");
	},

	getProductBySlug: async (slug) => {
		return await Product.findOne({ slug: slug });
	},

	getProductById: async (id) => {
		return await Product.findById(id);
	},

	getProductsByTag: async (tag) => {
		return await Product.find({ tags: tag }, "title price -_id");
	},

	addProduct: async (data) => {
		var product = new Product(data);
		await product.save();
	},

	editProduct: async (id, data) => {
		await Product.findByIdAndUpdate(id, {
			title: data.title,
			description: data.description,
			price: data.price,
		});
	},

	removeProduct: async (id) => {
		await Product.findByIdAndDelete(id);
	},
};
