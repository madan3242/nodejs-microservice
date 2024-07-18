const { Router } = require("express");
const { createProduct, getProducts, getProductDetails, getProductsByCategory } = require("../controllers/productController");

const router = Router();

router.get("/products", getProducts);

router.get("products/:id", getProductDetails);

router.get("/products/category/:type", getProductsByCategory);

router.post("/product/create", createProduct);

module.exports = router;