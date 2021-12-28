/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Product = require("./models/product");
const Customer = require("./models/customer");
const Order = require("./models/order");

const indexRoute = require("./routes/index-route");
const productsRoute = require("./routes/products-route");
const customersRoute = require("./routes/customers-route");
const ordersRoute = require("./routes/orders-route");

const uriDataBase = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}
@cluster0.eplf9.mongodb.net/BALTA?retryWrites=true&w=majority`;

mongoose.connect(uriDataBase).catch(e => console.log(e));

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	next();
});

app.use("/", indexRoute);
app.use("/products", productsRoute);
app.use("/customers", customersRoute);
app.use("/orders", ordersRoute);

module.exports = app;