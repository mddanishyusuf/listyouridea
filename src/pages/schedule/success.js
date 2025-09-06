import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import Layout from '@/components/layout';

export default function PaymentSuccess() {
    const { userObj } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        if (router.query.session_id && userObj) {
            verifyPaymentAndPublish();
        }
    }, [router.query, userObj]);

    const verifyPaymentAndPublish = async () => {
        try {
            const { session_id, schedule_id, slot_number, post_id } = router.query;

            const res = await fetch('/api/schedule/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    uid: userObj.uid,
                },
                body: JSON.stringify({
                    sessionId: session_id,
                    scheduleId: schedule_id,
                    slotNumber: parseInt(slot_number),
                    postId: post_id,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Payment successful! Your product has been published and will be featured this week.');

                // Redirect to home after 3 seconds
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage('Payment verification failed. Please contact support.');
        }
    };

    return (
        <Layout>
            <div className="payment-success-container">
                <div className="status-card">
                    {status === 'verifying' && (
                        <div className="status-content">
                            <div className="spinner"></div>
                            <h2>Verifying Payment</h2>
                            <p>{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="status-content success">
                            <div className="success-icon">✓</div>
                            <h2>Payment Successful!</h2>
                            <p>{message}</p>
                            <p className="redirect-note">Redirecting to homepage...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="status-content error">
                            <div className="error-icon">✗</div>
                            <h2>Payment Failed</h2>
                            <p>{message}</p>
                            <button
                                className="button button--primary"
                                onClick={() => router.push('/schedule')}
                            >
                                Back to Schedule
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
