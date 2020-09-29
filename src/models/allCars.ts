import mongoose from 'mongoose';
import Joi from 'joi';
const Schema = mongoose.Schema;

const allCarsSchema = new Schema({
    name: String,
    type: String,
    productionDate: Date,
    color: [String],
    amount: Number,
    condition: String,
    price: Number
});

const AllCars = mongoose.model('AllCars', allCarsSchema);

export function validateCar(details: Record<string, unknown>) {
    const schema = Joi.object({
        name: Joi.string().max(50).required(),
        type: Joi.string().max(50).required(),
        productionDate: Joi.date().required(),
        color: Joi.array().items(Joi.string()).required(),
        amount: Joi.number().required(),
        condition: Joi.string().max(50).required(),
        price: Joi.number().required()
    });
    return schema.validate(details, {
        abortEarly: false
    });
}

export { AllCars };
