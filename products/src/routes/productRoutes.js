const { Router } = require("express");
const { createProduct, getProducts, getProductDetails, getProductsByCategory, AddToWishlist, RemoveFromWishlist, RemoveFromCart, AddToCart } = require("../controllers/productController");
const Auth = require("../middlewares/auth");

const router = Router();

router.post("/product/create", createProduct);

router.get("/products", getProducts);

router.get("products/:id", getProductDetails);

router.get("/products/category/:type", getProductsByCategory);

router.put("/products/wishlist", Auth, AddToWishlist);

router.delete("/products/wishlist/:id", Auth, RemoveFromWishlist);

router.put("/products/cart", Auth, AddToCart);

router.delete("/products/cart/:id", Auth, RemoveFromCart);

module.exports = router;