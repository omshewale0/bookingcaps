import mongoose from "mongoose";
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7 // 1 week 
    },
});
const blacklistTokenModel = mongoose.model("BlacklistToken", blacklistTokenSchema); // collection name 'blacklistTokens' automatically होईल
export default blacklistTokenModel;