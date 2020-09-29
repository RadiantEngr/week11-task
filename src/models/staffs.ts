import mongoose from 'mongoose';
import Joi from 'joi';
const Schema = mongoose.Schema;

const staffSchema = new Schema({
    name: String,
    position: String,
    salary: Number,
    homeAddress: String
});

const Staffs = mongoose.model('Staffs', staffSchema);

export function validateStaff(details: Record<string, unknown>) {
    const schema = Joi.object({
        name: Joi.string().max(50).required(),
        position: Joi.string().max(50).required(),
        salary: Joi.number().required(),
        homeAddress: Joi.string().max(150).required()
    });
    return schema.validate(details, {
        abortEarly: false
    });
}

export { Staffs };
