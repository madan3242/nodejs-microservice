const { CUSTOMER_SERVICE } = require("../config");
const ShoppingService = require("../services/shoppingService");
const { SubscribeMessage, PublishMessage } = require("../utils");
const Auth = require('../middlewares/auth');

module.exports = async (app, channel) => {
    const service = new ShoppingService();

    SubscribeMessage(channel, service);

    app.post('/order', Auth, async (req, res, next) => {
        const { _id } = req.user;
        const { txnNumber } = req.body;
    
        try {
            const { data } = await service.PlaceOrder({_id, txnNumber});
    
            const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');
    
            PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(payload));
            
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/orders', Auth, async (req, res, next) => {
        const { _id } = req.user;
    
        try {
            const { data } = await service.GetOrders(_id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.put('/cart', Auth, async (req, res, next) => {
        const { _id } = req.user;
    
        const { data } = await service.AddToCart(_id, req.body._id);
    
        res.status(200).json(data);
    });

    app.delete('/cart/:id', Auth, async (req, res, next) => {
        const { _id } = req.user;
    
        const { data } = await service.AddToCart(_id, req.body._id);
    
        res.status(200).json(data);
    });

    app.get('/cart', Auth, async (req, res, next) => {
        const { _id } = req.user;
    
        try {
            const { data } = await service.GetCart(_id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });
}