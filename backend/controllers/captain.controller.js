import captainModel from "../models/capatain.model.js";
import { validationResult } from 'express-validator';
import { createCaptain } from "../services/captain.services.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";

export const registerCaptain = async (req, res, next) => {
    try {
        // 1. Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 2. Destructure data (Must happen before we use 'email')
        const { fullname, email, password, mobile, vehicle } = req.body;


        // 3. Check if captain already exists
        const isCaptainAlreadyExist = await captainModel.findOne({ $or: [{ email }, { mobile }] });


        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // 4. Hash the password
        const hashedPassword = await captainModel.hashPassword(password);

        // 5. Create the Captain
        // Note: Ensure your DB schema matches this structure. 
        // If 'vehicle' is a nested object in your schema, you might need to structure it differently here.
        const captain = await createCaptain({
            fullname,
            email,
            password: hashedPassword,
            mobile,
            vehicle: {
                color: vehicle.color,
                numberplate: vehicle.numberplate,
                vehicletype: vehicle.vehicletype,
                year: vehicle.year,
                capacity: vehicle.capacity
            }
        });

        // 6. Generate Token
        const token = captain.generateAuthToken();

        // 7. Send Response
        res.status(201).json({ token, captain });

    } catch (error) {
        next(error);
    }
}

export const loginCaptain = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

export const getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

export const logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split('')[1];

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');
    res.status(200).json({ massage: 'Logout successfully' });
}