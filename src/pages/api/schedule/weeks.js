import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import User from '@/models/User';
import moment from 'moment';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { uid } = req.headers;
        const user = await User.findOne({ uid });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Get next 4 weeks starting from next Monday
        const weeks = [];
        const today = moment();
        const nextMonday = moment().add(1, 'week').startOf('isoWeek');

        for (let i = 0; i < 4; i++) {
            const weekStart = nextMonday.clone().add(i, 'weeks');
            const weekEnd = weekStart.clone().endOf('isoWeek');

            // Find or create schedule for this week
            let schedule = await Schedule.findOne({
                weekStartDate: {
                    $gte: weekStart.startOf('day').toDate(),
                    $lt: weekStart.clone().add(1, 'day').startOf('day').toDate(),
                },
            })
                .populate({
                    path: 'slots.post',
                    select: 'productTitle productImage',
                })
                .populate({
                    path: 'slots.user',
                    select: 'name username',
                });

            if (!schedule) {
                // Create new schedule with 10 empty slots
                const slots = Array.from({ length: 10 }, (_, index) => ({
                    slotNumber: index + 1,
                    post: null,
                    user: null,
                    bookedAt: null,
                    paid: false,
                    paymentAmount: 29,
                }));

                schedule = new Schedule({
                    weekStartDate: weekStart.toDate(),
                    weekEndDate: weekEnd.toDate(),
                    slots,
                });

                await schedule.save();
                console.log(`Created schedule for week: ${weekStart.format('YYYY-MM-DD')}`);
            }

            const availableSlots = schedule.slots.filter((slot) => !slot.post || (!slot.paid && !slot.paymentPending)).length;

            weeks.push({
                weekStart: weekStart.format('YYYY-MM-DD'),
                weekEnd: weekEnd.format('YYYY-MM-DD'),
                weekDisplay: weekStart.format('MMM DD') + ' - ' + weekEnd.format('MMM DD, YYYY'),
                availableSlots,
                totalSlots: 10,
                schedule: schedule._id,
                slots: schedule.slots,
            });
        }

        res.status(200).json({ weeks });
    } catch (error) {
        console.error('Schedule weeks error:', error);
        res.status(500).json({ error: error.message });
    }
}
