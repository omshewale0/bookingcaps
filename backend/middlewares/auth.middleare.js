import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import captainModel from "../models/capatain.model.js";
export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
};

export const authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    if (!captain) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.captain = captain;
    next();
}