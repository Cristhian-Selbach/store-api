const express = require("express");
const router = express.Router();
const controller = require("../controllers/product-controller");
const authService = require("../services/auth-service");

router.get("/", controller.getAllProducts);

router.get("/:slug", controller.getProductBySlug);

router.get("/id/:id", controller.getProductById);

router.get("/tag/:tag", controller.getProductsByTag);

router.post("/", authService.isAdmin, controller.addProduct);

router.put("/:id", authService.isAdmin, controller.editProduct);

router.delete("/:id", authService.isAdmin, controller.removeProduct);

module.exports = router;
