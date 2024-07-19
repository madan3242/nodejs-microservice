const CustomerService = require("../services/customerService");
const { CreateChannel, SubscribeMessage } = require("../utils");


const service = new CustomerService();
const channel = await CreateChannel();
SubscribeMessage(channel, service);

const Signup = async (req, res, next) => {
    try {
        const {email, password, phone} = req.body;

        const { data } = await service.Signup({email, password, phone});
        
        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const Signin = async (req, res, next) => {
    try {
        const {email, password } = req.body;

        const { data } = await service.Signin({email, password });

        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const AddNewAddress = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const { street, postalCode, city, country } = req.body;

        const { data } = await service.AddNewAddress(_id, { 
            street, postalCode, city, country
        });

        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const GetProfile = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const { data } = await service.GetProfile({_id});

        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const GetShoppingDetails = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const { data } = await service.GetShoppingDetails(_id);

        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const GetWishlist = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const { data } = await service.GetWishlist(_id);

        return res.json(data);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    Signup,
    Signin,
    AddNewAddress,
    GetProfile,
    GetShoppingDetails,
    GetWishlist
}