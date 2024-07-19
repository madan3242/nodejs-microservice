const { CUSTOMER_BINDING_KEY } = require("../config");
const ShoppingService = require("../services/shoppingService");
const { CreateChannel, SubscribeMessage, PublishMessage } = require("../utils");

const service = new ShoppingService();
const channel = await CreateChannel();
SubscribeMessage(channel, service);

const PlaceOrder = async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
        const { data } = await service.PlaceOrder({_id, txnNumber});

        const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');

        PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload));
        
        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const GetOrders = async (req, res, next) => {
    const { _id } = req.user;

    try {
        const { data } = await service.GetOrders(_id);
        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const GetCart = async (req, res, next) => {
    const { _id } = req.user;

    try {
        const { data } = await service.GetCart(_id);
        return res.json(data);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    PlaceOrder,
    GetOrders,
    GetCart
}