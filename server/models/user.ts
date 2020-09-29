import Joi from 'joi';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import  dotenv from 'dotenv';
import path from 'path';

let envPath = path.resolve(__dirname, '../', '.env');
dotenv.config({ path: envPath });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 220,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
})

userSchema.methods.generateAuthenticationToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY as string);   
    return token;
}

export const User = mongoose.model('User', userSchema)
    


function validateUser(user:object): Joi.ValidationResult {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(220).required().email(),
        password: Joi.string().min(5).max(1024).required()
    })

    return schema.validate(user);
}

function validateLogin(user:object): Joi.ValidationResult {
    const schema = Joi.object({
        email: Joi.string().min(5).max(220).required().email(),
        password: Joi.string().min(5).max(1024).required()
    })

    return schema.validate(user);
}

export {validateUser, validateLogin};