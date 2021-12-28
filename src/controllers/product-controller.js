const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/product-repository");
const cloudinary = require("../services/image-service");
const formidable = require("formidable");

module.exports = {

	getAllProducts: async(req,res) => {
		try{
			var products = await repository.getAllProducts();
			res.status(200).send({
				"products" : products
			});	
		} 
		catch(e) {
			res.status(400).send("Error to listing products " + e);
		}
	},

	getProductBySlug: async(req,res) => {
		try{
			var product = await repository.getProductBySlug(req.params.slug);
			if(product) {
				res.status(200).send(product);
			}
			else res.status(400).send(`Cannot find the slug "${req.params.slug}"`);
		} 
		catch(e) {
			res.status(400).send("Error to listing the product " + e);
		}
	},

	getProductById: async(req,res) => {
		try{
			var product = await repository.getProductById(req.params.id);
			if(product) {
				res.status(200).send(product);
			}
			else res.status(400).send(`Cannot find product with id "${req.params.id}"`);
		}
		catch(e) {
			res.status(400).send("Error to listing the product " + e);
		}
	},

	getProductsByTag: async(req,res) => {
		try{
			var products = await repository.getProductsByTag(req.params.tag);
			if(products.length > 0) {
				res.status(200).send(products);
			}
			else res.status(400).send(`Cannot find products with tag "${req.params.tag}"`);
		}
		catch(e) {
			res.status(400).send("Error to listing the product " + e);
		}
	},

	addProduct: async(req,res) => {
		const form = formidable();
		form.parse(req, async (err, fields, files) => {
			if(err) {
				res.staus(400).send(err).end();
				return;
			}

			let contract = new ValidationContract();

			contract.hasMinLen(fields.title, 3, "the title must be have at least 3 caracters");
	
			if(!contract.isValid()) {
				res.status(400).send(contract.errors()).end();
				return;
			}
	
			try{
				const result = await cloudinary.uploader.upload(files.image.filepath, {
					resource_type: "image",
				});
	
				await repository.addProduct({
					title: fields.title,
					slug: fields.slug,
					description: fields.description,
					price: fields.price,
					active: true,
					tags: fields.tags.split(","),
					image: result.url
				});
				res.status(201).send(`The "${fields.title}" has been registred.`);
			}
			catch(e) {
				res.status(400).send("An error ocurred " + e.message);
			}
		});
	},

	editProduct: async(req,res) => {
		try{
			await repository.editProduct(req.params.id, req.body);
			res.status(200).send(`The "${req.body.title}" has been edited.`);
		}
		catch(e) {
			res.status(400).send("An error ocurred " + e);
		}
	},

	removeProduct: async(req,res) => {
		try{
			var product = await repository.getProductById(req.params.id);
			await repository.removeProduct(req.params.id);
			res.status(200).send(`The product "${product.title}" has been deleted.`);
		}
		catch(e) {
			res.status(400).send("An error ocurred " + e);
		}
	}
};