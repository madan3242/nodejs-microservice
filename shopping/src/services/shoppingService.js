const ShoppingRepository = require("../repository/shoppingRepository");
const { FormateData } = require("../utils");

class ShoppingService {
    constructor(){
        this.repository = new ShoppingRepository();
    }

    async GetCart({ _id }){
        const cartItems = await this.repository.Cart(_id);
        return FormateData(cartItems);
    }

    async PlaceOrder(userInput){
        const { _id, txnNumber } = userInput;

        try {
            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
            return FormateData(orderResult);
        } catch (error) {
            throw new Error("Data not found", err)
        }
    }

    async GetOrders(customerId){
        try {
            const order = await this.repository.Orders(customerId);
            return FormateData(order);
        } catch (error) {
            throw new Error("Data not found", err)
        }
    }

    async GetOrderDetails({ _id, orderId}){
        const order = await this.repository.Orders(orderId);
        return FormateData(order);
    }

    async ManageCart(customerId, item, qty, isRemove){
        try {
            const result = await this.repository.AddCartItem(customerId, item, qty, isRemove);
            return FormateData(result);
        } catch (error) {
            throw new Error("Data not found", err)
        }
    }

    async SubscribeEvents(payload){
        payload = JSON.parse(payload);
        const { event, data} = payload;
        const { userId, product, qty } = data;

        switch (event) {
            case 'ADD_TO_CART':
                this.ManageCart(userId, product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId, product, qty, true);
                break;
            default:
                break;
        }
    }

    async GetOrderPayload(userId, order, event){
        if (order) {
            const payload ={
                event: event,
                data: { userId, order }
            };

            return payload
        } else {
            return FormateData({ error: 'No order available'});
        }
    }
}

module.exports = ShoppingService;