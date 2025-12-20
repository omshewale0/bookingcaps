import { model } from "mongoose";
import captainModel from "../models/capatain.model.js";


export const createCaptain = async ({
    fullname,
    email,
    password,
    mobile,
    vehicle: {
        color,
        numberplate,
        capacity,
        vehicletype,
        year
    },
}) => {

    if (!fullname || !email || !password || !mobile || !color || !numberplate || !capacity || !vehicletype || !year) {
        throw new Error('All fields are required');
    }

    const captain = await captainModel.create({
        fullname,
        email,
        password,
        mobile,
        vehicle: {
            color,
            numberplate,
            capacity,
            vehicletype,
            year
        },
    });

    return captain;


}