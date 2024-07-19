const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
   customerId: { type: String, required: true },
   items: [
        {
            product: {
                _id: {type: String, required: true},
                name: { type: String },
                desc: { type: String },
                banner: { type: String },
                type: { type: String },
                unit: { type: Number },
                price: { type: Number },
                supplier: { type: String },
            },
            unit: { type: Number, require: true }
        }
   ]
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);