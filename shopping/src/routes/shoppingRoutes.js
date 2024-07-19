const express = require("express");
const Auth = require("../middlewares/auth");
const { PlaceOrder, GetOrders, GetCart } = require("../controllers/shoppingController");

const router = express.Router();

router.post("/order", Auth, PlaceOrder);

router.get("orders", Auth, GetOrders);

router.put("/cart", Auth, GetCart);

module.exports = router;