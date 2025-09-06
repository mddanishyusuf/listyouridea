// src/models/Post.js
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
            required: true,
        },
        featuredImages: {
            type: [String],
            required: true,
            validate: [
                {
                    validator: function (val) {
                        return val.length >= 1 && val.length <= 4;
                    },
                    message: 'Must have between 1 and 4 featured images',
                },
            ],
        },
        category: {
            type: String,
            required: true,
            enum: [
                'Productivity & Collaboration',
                'Marketing & Analytics',
                'Customer Relationship Management (CRM)',
                'Project Management',
                'E-commerce & Sales',
                'Communication & Messaging',
                'Design & Creative',
                'Developer Tools',
                'Finance & Accounting',
                'HR & Recruitment',
                'Education & E-learning',
                'Healthcare & Medical',
                'Security & Privacy',
                'Data & Business Intelligence',
                'AI & Machine Learning',
                'Social Media Management',
                'Content Management',
                'Automation & Workflow',
                'File Storage & Management',
                'Customer Support & Service',
                'Other',
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
        // Updated scheduling fields
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'published'],
            default: 'draft',
        },
        scheduledWeek: {
            type: Date,
            default: null,
        },
        publishedAt: {
            type: Date,
            default: null,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Add indexes for better performance
postSchema.index({ status: 1 });
postSchema.index({ scheduledWeek: 1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ category: 1 }); // Add index for category filtering

export default mongoose.models.Post || mongoose.model('Post', postSchema);
