import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required!'],
        minLength: [3, 'name should be at least 3 charcters!'],
        maxLength: [50, 'name should be at most 50 charcters!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Invalid Email!',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'password is required!'],
        minLength: 6,
    },
});
UserSchema.methods.createJwt = function () {
    const token = jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
};
UserSchema.methods.comparePasswords = async function (candidatePassword) {
    const isEqual = await bcrypt.compare(candidatePassword,this.password);
    return isEqual;
};
UserSchema.pre('save', async function () {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});

export default mongoose.model('User', UserSchema);
