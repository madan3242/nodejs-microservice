const ProductRepository = require("../repository/productRepository");
const { FormateData } = require("../utils");
const { ApiError } = require("../utils/errors");

class ProductService {
    constructor(){
        this.repository = new ProductRepository();
    }

    async CreateProduct(data){
        try {
            const result = await this.repository.CreateProduct(data);
            return FormateData(result);
        } catch (error) {
            throw new ApiError('Data not found');
        }
    }

    async GetProducts(){
        try {
            const products = await this.repository.FindProducts();

            let categories = {};

            products.map(({ type }) => {
                categories[type] = type;
            })

            return FormateData({
                products,
                categories: Object.keys(categories)
            })
        } catch (error) {
            throw new ApiError('Data not found');
        }
    }

    async GetProductDetails(productId){
        try {
            const product = await this.repository.FindById(productId);
            return FormateData(product);
        } catch (error) {
            throw new ApiError('Data not found');
        }
    }
    
    async GetProductsByCategory(category){
        try {
            const products = await this.repository.FindByCategory(category);
            return FormateData(products);
        } catch (error) {
            throw new ApiError('Data not found');
        }
    }

    async GetSelectedProducts(selectedIds){
        try {
            const products = await this.repository.FindSelectedProducts(selectedIds);
            return FormateData(products);
        } catch (error) {
            throw new ApiError('Data not found');
        }
    }

    async GetProductById(productId){
        try {
            return await this.repository.FindById(productId);
        } catch (error) {
            throw new ApiError('Data not found');
        }
    }

    async GetProductPayload(userId, {productId, qty}, event){
        const product = await this.repository.FindById(productId);

        if (product) {
            const payload = {
                event: event,
                data: {userId, product, qty}
            }
            return FormateData(payload)
        } else {
            return FormateData({ error: "No product available"})
        }
    }
}

module.exports = ProductService;