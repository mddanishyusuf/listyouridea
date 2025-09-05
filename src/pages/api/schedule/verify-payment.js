import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import Post from '@/models/Post';
import User from '@/models/User';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { uid } = req.headers;
        const { sessionId, scheduleId, slotNumber, postId } = req.body;

        const user = await User.findOne({ uid });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Verify the Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        // Verify metadata matches
        if (session.metadata.scheduleId !== scheduleId || session.metadata.slotNumber !== slotNumber.toString() || session.metadata.postId !== postId || session.metadata.userId !== user._id.toString()) {
            return res.status(400).json({ error: 'Payment verification failed - metadata mismatch' });
        }

        // Update schedule slot as paid
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const slot = schedule.slots.find((s) => s.slotNumber === slotNumber);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        // Book the slot
        slot.post = postId;
        slot.user = user._id;
        slot.bookedAt = new Date();
        slot.paid = true;
        slot.stripePaymentId = sessionId;
        await schedule.save();

        // Update post status to published
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.status = 'published';
        post.scheduledWeek = new Date(session.metadata.weekStartDate);
        post.publishedAt = new Date();
        await post.save();

        console.log(`Successfully published post: ${post.productTitle}`);

        res.status(200).json({
            message: 'Payment verified and product published successfully',
            postId: post._id,
            publishedAt: post.publishedAt,
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: error.message });
    }
}
