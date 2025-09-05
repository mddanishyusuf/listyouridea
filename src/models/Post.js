import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['product'],
            default: 'product',
        },
        productTitle: {
            type: String,
            required: true,
            maxlength: 200,
        },
        productDescription: {
            type: String,
            required: true,
            maxlength: 500,
        },
        productImage: {
            type: String,
            required: true, // Product logo is required
        },
        featuredImages: {
            type: [String], // Array of featured images
            required: true,
            validate: [
                {
                    validator: function (val) {
                        return val.length >= 1 && val.length <= 4; // At least 1, max 4
                    },
                    message: 'Must have between 1 and 4 featured images',
                },
            ],
        },
        categories: {
            type: [String],
            enum: ['landing pages', 'branding', 'mobile apps', 'logos'],
            default: [],
        },
        mentions: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
        productUrl: {
            type: String,
            required: true,
        },
        retweets: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
                default: [],
            },
        ],
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Post || mongoose.model('Post', postSchema);
