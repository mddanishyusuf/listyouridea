import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import Layout from '@/components/layout';
import { Text } from '@geist-ui/core';
import { CheckCircleBold, CheckSquareLinear } from '@/lib/icons';

export default function Schedule() {
    const { userObj } = useAuth();
    const router = useRouter();
    const [weeks, setWeeks] = useState([]);
    const [draftPosts, setDraftPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        if (userObj) {
            fetchData();
        }
    }, [userObj]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch available weeks
            const weeksRes = await fetch('/api/schedule/weeks', {
                headers: { uid: userObj.uid },
            });
            const weeksData = await weeksRes.json();

            // Fetch draft posts
            const draftsRes = await fetch('/api/posts?status=draft', {
                headers: { uid: userObj.uid },
            });
            const draftsData = await draftsRes.json();

            setWeeks(weeksData.weeks || []);
            setDraftPosts(draftsData || []);

            // Auto-select first draft post if available
            if (draftsData.length > 0) {
                setSelectedPost(draftsData[0]._id);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayAndSchedule = async () => {
        if (!selectedPost || !selectedWeek) {
            alert('Please select a product and week');
            return;
        }

        setBooking(true);
        try {
            // Find first available slot in the selected week
            const week = weeks.find((w) => w.weekStart === selectedWeek);
            if (!week) {
                alert('Selected week not found');
                setBooking(false);
                return;
            }

            const availableSlot = week.slots.find((slot) => !slot.post);
            if (!availableSlot) {
                alert('No slots available in this week');
                setBooking(false);
                return;
            }

            console.log('Booking slot:', {
                postId: selectedPost,
                weekStartDate: selectedWeek,
                slotNumber: availableSlot.slotNumber,
            });

            const res = await fetch('/api/schedule/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    uid: userObj.uid,
                },
                body: JSON.stringify({
                    postId: selectedPost,
                    weekStartDate: selectedWeek,
                    slotNumber: availableSlot.slotNumber,
                }),
            });

            const data = await res.json();
            console.log('Booking response:', data);

            if (res.ok && data.checkoutUrl) {
                // Redirect to Stripe Checkout
                window.location.href = data.checkoutUrl;
            } else {
                alert(data.error || 'Failed to create payment session');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to create payment session. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    // Helper function to format week display for small blocks
    const formatWeekShort = (weekStart, weekEnd) => {
        const start = new Date(weekStart);
        const end = new Date(weekEnd);
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    if (!userObj) {
        return (
            <Layout>
                <div className="schedule-container">
                    <div className="auth-message">
                        <h2>Please login to schedule your products</h2>
                    </div>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="schedule-container">
                    <div className="loading-message">
                        <p>Loading schedule...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const selectedWeekData = weeks.find((w) => w.weekStart === selectedWeek);

    return (
        <Layout>
            <div className="schedule-container">
                <div className="schedule-header">
                    <h1>Schedule Your Product</h1>
                    <div className="schedule-info">
                        <div className="pricing-info">
                            <h3>Beta Pricing: $29/week</h3>
                            <p>Future price: $89/week</p>
                        </div>
                        <div className="benefits">
                            <h4>What&apos;s included:</h4>
                            <ul>
                                <li>
                                    <CheckSquareLinear /> Featured on website for full week
                                </li>
                                <li>
                                    <CheckSquareLinear /> Backlink to your product
                                </li>
                                <li>
                                    <CheckSquareLinear /> Featured in weekly newsletter (45k+ subscribers)
                                </li>
                                <li>
                                    <CheckSquareLinear /> Social media promotion
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {draftPosts.length === 0 ? (
                    <div className="no-drafts">
                        <h2>No draft products found</h2>
                        <p>Please create a product first to schedule it.</p>
                        <button
                            className="button button--primary"
                            onClick={() => router.push('/submit')}
                        >
                            Create Product
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="product-selector">
                            <h3>Select Product to Schedule:</h3>
                            <div className="product-list">
                                {draftPosts.map((post) => (
                                    <div
                                        key={post._id}
                                        className={`product-card ${selectedPost === post._id ? 'selected' : ''}`}
                                        onClick={() => setSelectedPost(post._id)}
                                    >
                                        <img
                                            src={post.productImage}
                                            alt={post.productTitle}
                                        />
                                        <div className="product-info">
                                            <h4>{post.productTitle}</h4>
                                            <p>{post.productDescription.substring(0, 100)}...</p>
                                        </div>
                                        {selectedPost === post._id && <CheckCircleBold />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="weeks-container">
                            <h3>Select Week (Next 4 Weeks)</h3>
                            <div className="weeks-blocks">
                                {weeks.slice(0, 4).map((week) => (
                                    <div
                                        key={week.weekStart}
                                        className={`week-block ${selectedWeek === week.weekStart ? 'selected' : ''} ${week.availableSlots === 0 ? 'unavailable' : ''}`}
                                        onClick={() => week.availableSlots > 0 && setSelectedWeek(week.weekStart)}
                                    >
                                        <div className="week-date">{formatWeekShort(week.weekStart, week.weekEnd)}</div>
                                        <div className="week-slots">
                                            {week.availableSlots > 0 ? (
                                                <span className="available">
                                                    {week.availableSlots} slot{week.availableSlots !== 1 ? 's' : ''}
                                                </span>
                                            ) : (
                                                <span className="full">Full</span>
                                            )}
                                        </div>
                                        {selectedWeek === week.weekStart && <CheckCircleBold />}
                                    </div>
                                ))}
                            </div>

                            {weeks.slice(0, 4).every((week) => week.availableSlots === 0) && (
                                <div className="no-availability">
                                    <p>All slots are full for the next 4 weeks.</p>
                                    <p>Please check back later or contact support.</p>
                                </div>
                            )}
                        </div>

                        {selectedPost && selectedWeek && (
                            <div className="payment-section">
                                <div className="selection-summary">
                                    <h3>Selected:</h3>
                                    <div className="summary-details">
                                        <div className="selected-product">
                                            <strong>Product:</strong> {draftPosts.find((p) => p._id === selectedPost)?.productTitle}
                                        </div>
                                        <div className="selected-week">
                                            <strong>Week:</strong> {selectedWeekData?.weekDisplay}
                                        </div>
                                        <div className="price">
                                            <strong>Price:</strong> $29 (Beta pricing)
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="button button--primary payment-button"
                                    onClick={handlePayAndSchedule}
                                    disabled={booking}
                                >
                                    {booking ? 'Processing...' : 'Pay $29 & Schedule'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
