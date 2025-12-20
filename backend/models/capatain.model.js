import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
        minlength: [3, 'First must be at least 3 charecters long']
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        require: true,
        minlength: [6, 'Password must be at least 6 charecters long']
    },
    mobile: {
        type: Number,
        require: true,
        minlength: [10, 'mobile no. must be at least 10 charecters long']
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    vehicle: {
        color: {
            type: String,
            require: true,
            minlength: [3, 'First must be at least 3 charecters long']
        },
        numberplate: {
            type: String,
            require: true,
            minlength: [3, 'Please fill a valid number plate']
        },
        vehicletype: {
            type: String,
            require: true,
            enum: ['car', 'bike', 'truck'],
            default: 'car'
        },
        year: {
            type: String,
        },
        capacity: {
            type: Number,
            require: true,
        }

    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }

})

// ✅ CORRECT WAY
captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
captainSchema.method.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}
const captainModel = mongoose.model('captain', captainSchema);

export default captainModel;
