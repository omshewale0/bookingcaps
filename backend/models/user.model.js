import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: [3, 'full Name must be at 3 characters long'],

    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'full Name must be at 3 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    sccketId: {
        type: String,
    },
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1w' });
    return token;
}
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}
const userModel = mongoose.model("User", userSchema); // collection name 'users' automatically होईल
export default userModel;
