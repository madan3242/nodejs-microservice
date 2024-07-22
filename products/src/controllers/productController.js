const { CUSTOMER_SERVICE, SHOPPING_SERVICE } = require("../config");
const ProductService = require("../services/productService");
const { CreateChannel } = require("../utils");
const MessageBroker = require("../utils/messageBroker");
// const { CreateChannel, PublishMessage } = require("../utils");

const service = new ProductService();
const channel =  CreateChannel();

const createProduct = async (req, res, next) => {
    try {
        const { name, desc, type, unit, price, available, suplier, banner } = req.body;
        const { data } = await service.CreateProduct({
            name, desc, type, unit, price, available, suplier, banner
        });
        return res.json({msg: "Product created",data});
    } catch (error) {
        next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        const { data } = await service.GetProducts();
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const getProductDetails = async (req, res, next) => {
    try {
        const { data } = await service.GetProductDetails();
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const getProductsByCategory = async (req, res, next) => {
    const type = req.params.type;

    try {
        const { data } = await service.GetProductsByCategory(type);
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const AddToWishlist = async (req, res, next) => {
    const { _id } = req.user;

    //get payload to send to customer service
    const { data } = await service.GetProductPayload(_id, { productId: req.body._id }, 'ADD_TO_WISHLIST');

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    res.status(200).json(data.data.product);
}


const RemoveFromWishlist = async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    const { data } = await service.GetProductPayload(_id, { productId }, 'REMOVE_FROM_WISHLIST');

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    res.status(200).json(data.data.product);
}

const AddToCart = async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetProductPayload(_id, { productId: req.body._id, qty: req.body.qty }, 'ADD_TO_CART');

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

    const response = {
        product: data.data.product,
        unit: data.data.qty
    }

    res.status(200).json(response);
}

const RemoveFromCart = async (req, res, next) => {
    const { _id } = req.user;

    const productId = req.params.id;

    const { data } = await service.GetProductPayload(_id, { productId }, 'REMOVE_FROM_CART');

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

    const response = {
        product: data.data.product,
        unit: data.data.qty
    }

    res.status(200).json(response);
}

module.exports = {
    createProduct,
    getProducts,
    getProductDetails,
    getProductsByCategory,
    AddToWishlist,
    RemoveFromWishlist,
    AddToCart,
    RemoveFromCart,
}