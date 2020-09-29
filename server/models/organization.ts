import mongoose from 'mongoose';
import Joi from 'joi';
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    organization: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    products: [String],
    marketValue: String,
    address: String,
    ceo: String,
    country: String,
    noOfEmployees: Number,
    employees: [String]
});

const Organization = mongoose.model('OrganizationSchema', organizationSchema);

function validateOrganization(details: Record<string, unknown>) {
    const schema = Joi.object({
        organization: Joi.string().max(50).required().trim(),
        products: Joi.array().items(Joi.string()).required(),
        marketValue: Joi.string().min(2).max(100).required(),
        address: Joi.string().max(150).required(),
        ceo: Joi.string().min(2).max(20).required(),
        country: Joi.string().required(),
        employees: Joi.array().items(Joi.string()).required(),
    });
    return schema.validate(details, {
        abortEarly: false
    });
}


export {Organization, validateOrganization};