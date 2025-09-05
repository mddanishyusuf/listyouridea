import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import Post from '@/models/Post';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { uid } = req.headers;
        const { scheduleId, slotNumber, postId } = req.body;

        const user = await User.findOne({ uid });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Find the schedule and release the slot
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const slot = schedule.slots.find((s) => s.slotNumber === slotNumber);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        // Verify this user had reserved this slot
        if (slot.user?.toString() !== user._id.toString() || slot.post?.toString() !== postId) {
            return res.status(403).json({ error: 'Unauthorized to cancel this reservation' });
        }

        // Release the slot
        slot.post = null;
        slot.user = null;
        slot.bookedAt = null;
        slot.paid = false;
        slot.paymentPending = false;

        await schedule.save();

        // Ensure post remains in draft status
        const post = await Post.findById(postId);
        if (post) {
            post.status = 'draft';
            post.scheduledWeek = null;
            post.publishedAt = null;
            await post.save();
        }

        console.log(`Released slot ${slotNumber} for cancelled payment`);

        res.status(200).json({
            message: 'Slot released successfully',
        });
    } catch (error) {
        console.error('Cancel payment error:', error);
        res.status(500).json({ error: error.message });
    }
}
