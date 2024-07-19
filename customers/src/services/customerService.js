const CustomerRepository = require("../repository/customerRepository");
const { FormateData, GeneratePassword, GenerateSignature, ValidatePassword } = require("../utils");
const { ApiError } = require("../utils/errors");

class CustomerService {
    constructor(){
        this.repository = new CustomerRepository();
    }

    async Signup(userInputs){
        const { email, password, phone } = userInputs;
        try {
            let userPassword = await GeneratePassword(password);

            const existingCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone});

            const token = await GenerateSignature({ email: email, _id: existingCustomer._id});

            return FormateData({ id: existingCustomer._id, token});
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async Signin(userInputs){
        const { email, password } = userInputs;
        try {
            const existingCustomer = await this.repository.FindCustomer({ email });

            if (existingCustomer) {
                const validPassword = await ValidatePassword(password, existingCustomer.password);

                if (validPassword) {
                    const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id});
                    return FormateData({ id: existingCustomer._id, token});
                }
            }

            return FormateData(null);
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async AddNewAddress(_id, userInputs){
        const { street, postalCode, city, country } = userInputs;

        try {
            const result = await this.repository.CreateAddress({ _id, street, postalCode, city, country });
            return FormateData(result);
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async GetProfile(id){
        try {
            const existingCustomer = await this.repository.FindCustomerByID({id});
            return FormateData(existingCustomer);
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async GetShoppingDetails(id){
        try {
            const existingCustomer = await this.repository.FindCustomerByID({id});

            if (existingCustomer) {
                return FormateData(existingCustomer);
            }

            return FormateData({ msg: 'Error' });
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async GetWishlist(customerId){
        try {
            const wishlistItems = await this.repository.Wishlist(customerId);
            return FormateData(wishlistItems);
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async AddToWishlist(customerId, product){
        try {
            const result = await this.repository.AddWishlistItem(customerId, product);
            return FormateData(result);
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async ManageCart(customerId, product, qty, isRemove){
        try {
            const result = await this.repository.AddCartItem(customerId, product, qty, isRemove);
            return FormateData(result);
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async ManageOrder(customerId, order){
        try {
            const result = await this.repository.AddOrderToProfile(customerId, order);
            return FormateData(result);
        } catch (error) {
            throw new ApiError("Data not found", error);
        }
    }

    async SubscribeEvents(payload){
        payload = JSON.parse(payload);
        const { event, data} = payload;
        const { userId, product, order, qty } = data;

        switch (event) {
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId, product);
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId, product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId, product, qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId, order);
                break;
            default:
                break;
        }
    }
}

module.exports = CustomerService;