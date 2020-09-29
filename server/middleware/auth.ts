import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

async function auth (req: any) {
    const input = "onaolapo.ak@gmail.com";
    
    const user = await User.findOne({ email: input });
    if (!user) {
        throw Error ("Authentication failed!")
    }

    try {

    const payload = {
        id: user.id,
        email: user["email"]
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '3h'
    })

    req.headers.authorization = token;
    return req;
    } catch(ex) {
        console.error(ex.message)
    }
}

export default auth;