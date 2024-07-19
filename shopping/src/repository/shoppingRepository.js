const { Cart, Order } = require("../models");
const { ApiError, STATUS_CODES } = require("../utils/errors");
const { v4: uuidv4} = require("uuid");

class ShoppingRepository {
    async Orders(customerId){
        try {
            const orders = await Order.find({ customerId }).populate('items.product');
            return orders;
        } catch (error) {
            throw ApiError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders');
        }
    }

    async Cart(customerId){
        const cartItems = await Cart.find({ customerId });

        if (cartItems) {
            return cartItems;
        }

        throw new Error("Data not found");
    }

    async AddCartItem(customerId, item, qty, isRemove){

        const cart = await Cart.findOne({ customerId });

        const { _id } = item;

        if (cart) {
            let isExist = false;

            let cartItems = cart.items;

            if (cartItems.length > 0) {
                cartItems.map((item) => {
                    if (item.product._id.toString() === _id.toString()) {
                        if (isRemove) {
                            cartItems.splice(cartItems.indexOf(item), 1);
                        } else {
                            item.unit = qty;
                        }
                        isExist = true;
                    }
                });
            }

            if (!isExist && !isRemove) {
                cartItems.push({ product: {...item }, unit: qty});
            }

            cart.items = cartItems;

            return await cart.save();
        } else {
            return await Cart.create({
                customerId,
                items: [{ product: { ...item }, unit: qty }]
            })
        }
    }

    async CreateNewOrder(customerId, txnId){
        try {
            const cart = await Cart.findById({ customerId });

            if (cart) {
                let amount = 0;

                let cartItems = cart.items;

                if (cartItems.length > 0) {
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) * parseInt(item.unit);
                    });

                    const orderId = uuidv4();

                    const order = new Order({
                        orderId,
                        customerId,
                        amount,
                        txnId,
                        status: "recived",
                        items: cartItems
                    })

                    cart.items = [];

                    const result = await order.save();
                    return result;
                }
            }
        } catch (error) {
            throw ApiError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create New Orders');
        }
    }

};

module.exports = ShoppingRepository;