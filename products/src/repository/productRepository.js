const { Product } = require("../models/Product");
const { ApiError, STATUS_CODES } = require("../utils/errors");

class ProductRepository {
    async CreateProduct({name, desc, type, unit, price, available, suplier, banner}) {
        try {
            const product = new Product({
                name, desc, type, unit, price, available, suplier, banner
            });

            const result = await product.save();
            return result;
        } catch (error) {
            throw new ApiError("API ERROR", STATUS_CODES.INTERNAL_ERROR, "Unable to Create Product")
        }
    }

    async FindProducts(){
        try {
            return await Product.find();
        } catch (error) {
            throw new ApiError("API ERROR", STATUS_CODES.INTERNAL_ERROR, "Unable to Get Products")
        }
    }

    async FindById(id){
        try {
            return await Product.findById(id);
        } catch (error) {
            throw new ApiError("API ERROR", STATUS_CODES.INTERNAL_ERROR, "Unable to Find Product")
        }
    }

    async FindByCategory(category){
        try {
            const products = await Product.find({ type: category });
            return products;
        } catch (error) {
            throw new ApiError("API ERROR", STATUS_CODES.INTERNAL_ERROR, "Unable to Find Category")
        }
    }

    async FindSelectedProduct(selectedIds){
        try {
            const products = await Product.find()
                .where("_id")
                .in(selectedIds.map((_id) => _id))
                .exec();
            return products;
        } catch (error) {
            throw new ApiError("API ERROR", STATUS_CODES.INTERNAL_ERROR, "Unable to Find Product")
        }
    }
};

module.exports = ProductRepository;