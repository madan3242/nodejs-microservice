const { CUSTOMER_SERVICE, SHOPPING_SERVICE } = require("../config");
const ProductService = require("../services/productService");
const { PublishMessage } = require("../utils");
const Auth = require('../middlewares/auth');

module.exports = async(app, channel) => {
    const service = new ProductService();

    app.post('/product/create', async (req, res, next) => {
        try {
            const { name, desc, type, unit, price, available, suplier, banner } = req.body;
            const { data } = await service.CreateProduct({
                name, desc, type, unit, price, available, suplier, banner
            });
            return res.json({msg: "Product created",data});
        } catch (error) {
            next(error);
        }
    });

    app.get('/', async (req, res, next) => {
        try {
            const { data } = await service.GetProducts();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/:id', async (req, res, next) => {
        const productId = req.params.id;
        try {
            const { data } = await service.GetProductDetails(productId);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/category/:type', async (req, res, next) => {
        const type = req.params.type;
    
        try {
            const { data } = await service.GetProductsByCategory(type);
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.put('/wishlist', Auth, async (req, res, next) => {
        const { _id } = req.user;
    
        //get payload to send to customer service
        const { data } = await service.GetProductPayload(_id, { productId: req.body._id }, 'ADD_TO_WISHLIST');
    
        PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    
        res.status(200).json(data.data.product);
    });

    app.delete('/wishlist/:id', Auth, async (req, res, next) => {
        const { _id } = req.user;
        const productId = req.params.id;
    
        const { data } = await service.GetProductPayload(_id, { productId }, 'REMOVE_FROM_WISHLIST');
    
        PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    
        res.status(200).json(data.data.product);
    })

    app.put('/cart', Auth, async (req, res, next) => {
        const { _id } = req.user;
    
        const { data } = await service.GetProductPayload(_id, { productId: req.body._id, qty: req.body.qty }, 'ADD_TO_CART');
    
        PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    
        PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));
    
        const response = {
            product: data.data.product,
            unit: data.data.qty
        }
    
        res.status(200).json(response);
    });

    app.delete('/cart/:id', Auth, async (req, res, next) => {
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
    })
}