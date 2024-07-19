const { Address, Customer } = require("../models");
const { ApiError, STATUS_CODES } = require("../utils/errors");

class CustomerRepository {
    async CreateCustomer({ email, password, phone}){
        try {
            const customer = new Customer({
                email, password, phone, address: [],
            });

            const result = await customer.save();
            return result;
        } catch (error) {
            throw new ApiError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to create Customer")
        }
    }

    async CreateAddress({ _id, street, postalCode, city, country }){
        try {
            const profile = await Customer.findById(_id);

            if (profile) {
                const newAddress = new Address({
                    street,
                    postalCode,
                    city,
                    country
                });

                await newAddress.save();

                profile.address.push(newAddress);
            }
            return await profile.save();
        } catch (error) {
            throw new ApiError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
        }
    }

    async FindCustomer({ email }){
        const existingCustomer = await Customer.findOne({ email });
        return existingCustomer;
    }

    async FindCustomerByID({ id }){
        try {
            const existingCustomer = await Customer.findById(id).populate("address");

            return existingCustomer;
        } catch (error) {
            throw new ApiError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to find Customer");
        }
    }

    async Wishlist(customerId){
        try {
            const profile = await Customer.findById(customerId).populate("wishlist");

            return profile.wishlist;
        } catch (error) {
            throw new ApiError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Get Wishlist");
        }
    }

    async AddWishlistItem(customerId, { _id, name, desc, price, available, banner }){
        const product = {
            _id, name, desc, price, available, banner
        }
        try {
            const profile = await Customer.findById(customerId).populate("wishlist");

            if (profile) {
                let wishlist = profile.wishlist;

                if (wishlist.length > 0) {
                    let isExist = false;
                    wishlist.map((item) => {
                        if (item._id.toString() === product._id.toString()) {
                            const index = wishlist.indexOf(item);
                            wishlist.splice(index, 1);
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        wishlist.push(product);
                    }
                } else {
                    wishlist.push(product);
                }
                profile.wishlist = wishlist;
            }

            const result = await profile.save();
            
            return result.wishlist;
        } catch (error) {
            throw new ApiError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Add to Wishlist");
        }
    }

    async AddCartItem(customerId, { _id, name, price, banner }, qty, isRemove){
        try {
            const profile = await Customer.findById(customerId).populate("cart");

            if (profile) {
                const cartItem = {
                    product: { _id, name, price, banner },
                    unit: qty
                };

                let cartItems = profile.cart;

                if (cartItems.length > 0) {
                    let isExist = false;
                    cartItems.map((item) => {
                        if (item.product._id.toString() === product._id.toString()) {
                            if (isRemove) {
                                cartItems.splice(cartItems.indexOf(item), 1);
                            } else {
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        cartItems.push(cartItem);
                    }
                } else {
                    cartItems.push(cartItems);
                }

                profile.cart = cartItems;

                const result = await profile.save();

                return result;
            }
            throw new Error("Unable to add to cart!");
        } catch (error) {
            throw new ApiError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Add to Cart!");
        }
    }
    
    async AddOrderToProfile(customerId, order){
        try {
            const profile = await Customer.findById(customerId);

            if (profile) {
                if (profile.orders == undefined) {
                    profile.orders = [];
                }

                profile.orders.push(order);

                profile.cart = [];

                const result = await profile.save();

                return result;
            }

            throw new Error("Unable to add order!");
        } catch (error) {
            throw new ApiError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Add to Order!");
        }
    }
};

module.exports = CustomerRepository;