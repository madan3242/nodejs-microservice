const CustomerService = require("../services/customerService");
const { SubscribeMessage } = require("../utils");

module.exports = (app, channel) => {
    const service = new CustomerService();

    SubscribeMessage(channel, service);

    app.post('/signup', async (req, res, next) => {
        try {
            const {email, password, phone} = req.body;
    
            const { data } = await service.Signup({email, password, phone});
            
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.post('/login', async (req, res, next) => {
        try {
            const {email, password } = req.body;
    
            const { data } = await service.Signin({email, password });
    
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.post('/address', async (req, res, next) => {
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
    });

    app.get('/profile', async (req, res, next) => {
        try {
            const { _id } = req.user;
    
            const { data } = await service.GetProfile({_id});
    
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/shopping-details', async (req, res, next) => {
        try {
            const { _id } = req.user;
    
            const { data } = await service.GetShoppingDetails(_id);
    
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/wishlist', async (req, res, next) => {
        try {
            const { _id } = req.user;
    
            const { data } = await service.GetWishlist(_id);
    
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });
}