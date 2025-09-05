import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { uid } = req.headers;
        const user = await User.findOne({ uid });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const schedules = await Schedule.find({}).sort({ weekStartDate: 1 });

        res.status(200).json({
            count: schedules.length,
            schedules: schedules.map((s) => ({
                id: s._id,
                weekStart: s.weekStartDate,
                weekEnd: s.weekEndDate,
                availableSlots: s.slots.filter((slot) => !slot.post).length,
                totalSlots: s.slots.length,
            })),
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ error: error.message });
    }
}
