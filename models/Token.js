import mongoose, { SchemaType } from 'mongoose';
const TokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, expires: 3600, default: Date.now },
});

export default mongoose.model('Token', TokenSchema);
