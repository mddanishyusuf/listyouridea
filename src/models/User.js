import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            default: '',
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        photoURL: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            default: 'free',
        },
        stripe_customer: {
            type: String,
            default: null,
        },
        api_key: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
