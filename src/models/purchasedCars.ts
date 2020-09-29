import mongoose from 'mongoose';
import Joi from 'joi';
const Schema = mongoose.Schema;

const purchasedCarsSchema = new Schema({
    type: String,
    modelNumber: String,
    saleDate: Date,
    buyer: String,
    color: String
});

const PurchasedCars = mongoose.model('PurchasedCars', purchasedCarsSchema);

export function validatePurchasedCar(details: Record<string, unknown>) {
    const schema = Joi.object({
        type: Joi.string().max(50).required(),
        modelNumber: Joi.string().max(50).required(),
        saleDate: Joi.date().required(),
        buyer: Joi.string().max(50).required(),
        color: Joi.string().max(50).required(),
    });
    return schema.validate(details, {
        abortEarly: false
    });
}

export { PurchasedCars };