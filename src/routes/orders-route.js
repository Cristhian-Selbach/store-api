const express = require("express");
const router = express.Router();
const controller = require("../controllers/Order-controller");
const authService = require("../services/auth-service");

router.get("/", authService.authorize, controller.getAllOrders);
router.post("/", authService.authorize, controller.addOrder);

module.exports = router;