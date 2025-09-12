import Layout from '@/components/layout';
import ImageCarousel from '@/components/ImageCarousel';
import { useAuth } from '@/contexts/authContext';
import { formatContent } from '@/lib/functions';
import { BoxMinimalisticOutline, ChatSquareOutline, EyeLinear, HeartOutline, RepeatLinear } from '@/lib/icons';
import { Text } from '@geist-ui/core';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default function Home() {
    const { userObj } = useAuth(); // Optional - only for like functionality
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshPosts, setRefreshPosts] = useState(0);

    // Add carousel state
    const [carouselImages, setCarouselImages] = useState([]);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const [carouselInitialIndex, setCarouselInitialIndex] = useState(0);

    useEffect(() => {
        fetchPosts();
    }, [refreshPosts]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            // Fetch published posts without requiring authentication
            const res = await fetch('/api/posts/public', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const result = await res.json();
                setPosts(result);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add carousel functions
    const openCarousel = (images, initialIndex = 0) => {
        setCarouselImages(images);
        setCarouselInitialIndex(initialIndex);
        setIsCarouselOpen(true);
    };

    const closeCarousel = () => {
        setIsCarouselOpen(false);
    };

    // Update the renderFeaturedImages function
    const renderFeaturedImages = (images) => {
        if (!images || images.length === 0) return null;

        return (
            <div className="featured-images-row">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Featured ${index + 1}`}
                        className="featured-image-small"
                        onClick={() => openCarousel(images, index)}
                    />
                ))}
            </div>
        );
    };

    // Add upvote functionality (only works if user is logged in)
    const handleUpvote = async (postId) => {
        if (!userObj) {
            // Optionally show a login prompt or redirect to login
            alert('Please login to like products');
            return;
        }

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    uid: userObj.uid,
                },
            });

            if (res.ok) {
                setRefreshPosts((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };

    const formatTimeAgo = (date) => {
        return moment(date).fromNow();
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading featured products...</p>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <Layout>
                <div className="posts">
                    {posts.map((p, k) => (
                        <div
                            className="post-card"
                            key={k}
                        >
                            <div className="content">
                                <div className="content-head">
                                    <div className="product-logo">
                                        <img
                                            src={p.productImage}
                                            alt="Product Logo"
                                            style={{
                                                borderRadius: '10px',
                                                width: '40px',
                                                height: '40px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="product-description">
                                            <span style={{ color: '#cccccc' }}>{p.productTitle}</span> — {p.productDescription}
                                        </div>
                                        {p.publishedAt && (
                                            <div className="posted-date">
                                                <small>{formatTimeAgo(p.publishedAt)}</small>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="product-post">
                                    {/* Featured Images with click to open carousel */}
                                    {p.featuredImages && p.featuredImages.length > 0 && (
                                        <div
                                            className="featured-image"
                                            style={{ marginTop: '12px' }}
                                        >
                                            <img
                                                src={p.featuredImages[0]}
                                                height={160}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Layout>

            {/* Add the carousel modal */}
            <ImageCarousel
                images={carouselImages}
                isOpen={isCarouselOpen}
                onClose={closeCarousel}
                initialIndex={carouselInitialIndex}
            />
        </>
    );
}
