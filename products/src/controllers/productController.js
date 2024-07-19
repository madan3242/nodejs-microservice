const ProductService = require("../services/productService");
const { CreateChannel } = require("../utils");

const service = new ProductService();
const channel = await CreateChannel();

const createProduct = async (req, res, next) => {
    try {
        const { name, desc, type, unit, price, available, suplier, banner } = req.body;
        const {} = await service.CreateProduct({
            name, desc, type, unit, price, available, suplier, banner
        });
        return res.json(data);
    } catch (error) {
        next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        const {} = await service.GetProducts();
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const getProductDetails = async (req, res, next) => {
    try {
        const { data } = await service.GetProductDetails();
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const getProductsByCategory = async (req, res, next) => {
    const type = req.params.type;

    try {
        const { data } = await service.GetProductsByCategory(type);
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}



module.exports = {
    createProduct,
    getProducts,
    getProductDetails,
    getProductsByCategory
}