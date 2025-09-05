import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import Post from '@/models/Post';
import User from '@/models/User';
import moment from 'moment';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { uid } = req.headers;
        const { postId, weekStartDate, slotNumber } = req.body;

        console.log('Booking request:', { postId, weekStartDate, slotNumber, uid });

        const user = await User.findOne({ uid });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Verify post belongs to user and is in draft status
        const post = await Post.findOne({
            _id: postId,
            author: user._id,
            status: 'draft',
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found or already scheduled' });
        }

        // Parse the date and find the schedule
        const searchDate = moment(weekStartDate).startOf('day');
        console.log('Searching for schedule with date:', searchDate.toDate());

        let schedule = await Schedule.findOne({
            weekStartDate: {
                $gte: searchDate.toDate(),
                $lt: searchDate.clone().add(1, 'day').toDate(),
            },
        });

        if (!schedule) {
            // Create the schedule if it doesn't exist
            const weekStart = moment(weekStartDate);
            const weekEnd = weekStart.clone().endOf('isoWeek');

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
            console.log('Created new schedule:', schedule._id);
        }

        // Check if slot is available
        const slot = schedule.slots.find((s) => s.slotNumber === slotNumber);
        if (!slot) {
            return res.status(400).json({ error: 'Invalid slot number' });
        }

        if (slot.post) {
            return res.status(400).json({ error: 'Slot already booked' });
        }

        // TEMPORARILY reserve the slot (but don't mark as paid or change post status yet)
        slot.post = post._id;
        slot.user = user._id;
        slot.bookedAt = new Date();
        slot.paid = false;
        slot.paymentPending = true; // Add this flag to indicate payment is pending

        await schedule.save();

        // DON'T change post status yet - keep it as 'draft' until payment is confirmed
        // post.status = 'scheduled';  // Remove this line
        // post.scheduledWeek = new Date(weekStartDate);  // Remove this line
        // await post.save();  // Remove this line

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Featured Product Listing - ${post.productTitle}`,
                            description: `Week of ${moment(weekStartDate).format('MMM DD')} - ${moment(weekStartDate).endOf('isoWeek').format('MMM DD, YYYY')}`,
                            images: [post.productImage],
                        },
                        unit_amount: 2900, // $29.00 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/success?session_id={CHECKOUT_SESSION_ID}&schedule_id=${schedule._id}&slot_number=${slotNumber}&post_id=${post._id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/schedule?cancelled=true&schedule_id=${schedule._id}&slot_number=${slotNumber}&post_id=${post._id}`,
            customer_email: user.email,
            metadata: {
                scheduleId: schedule._id.toString(),
                slotNumber: slotNumber.toString(),
                postId: post._id.toString(),
                userId: user._id.toString(),
                weekStartDate: weekStartDate,
            },
        });

        console.log('Created Stripe session:', session.id);

        res.status(200).json({
            sessionId: session.id,
            checkoutUrl: session.url,
            message: 'Redirecting to payment...',
        });
    } catch (error) {
        console.error('Book slot error:', error);
        res.status(500).json({ error: error.message });
    }
}
