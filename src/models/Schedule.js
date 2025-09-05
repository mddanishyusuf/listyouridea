import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
    {
        weekStartDate: {
            type: Date,
            required: true,
            unique: true,
        },
        weekEndDate: {
            type: Date,
            required: true,
        },
        slots: [
            {
                slotNumber: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 10,
                },
                post: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Post',
                    default: null,
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    default: null,
                },
                bookedAt: {
                    type: Date,
                    default: null,
                },
                paid: {
                    type: Boolean,
                    default: false,
                },
                paymentPending: {
                    type: Boolean,
                    default: false,
                },
                paymentAmount: {
                    type: Number,
                    default: 29,
                },
                stripePaymentId: {
                    type: String,
                    default: null,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Create indexes
scheduleSchema.index({ weekStartDate: 1 });
scheduleSchema.index({ 'slots.post': 1 });
scheduleSchema.index({ 'slots.user': 1 });

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
