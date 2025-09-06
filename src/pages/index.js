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
                <div className="homepage-header">
                    <div className="hero-section">
                        <h1>Discover Amazing Products</h1>
                        <p>Find the best SaaS products, tools, and services featured by our community</p>
                    </div>

                    {posts.length === 0 && (
                        <div className="empty-state">
                            <h2>No products featured yet</h2>
                            <p>Be the first to submit your product!</p>
                        </div>
                    )}
                </div>

                <div className="posts">
                    {posts.map((p, k) => (
                        <div
                            className="post-card"
                            key={k}
                        >
                            <div className="author-image">
                                <img
                                    src={p.productImage}
                                    alt="Product Logo"
                                    style={{
                                        borderRadius: '8px',
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <div className="content">
                                <div className="content-head">
                                    <div>
                                        <h3 style={{ fontSize: 15, margin: 0 }}>{p.productTitle}</h3>
                                        {p.category && <div className="product-category">{p.category}</div>}
                                        {p.publishedAt && (
                                            <div className="posted-date">
                                                <small>{formatTimeAgo(p.publishedAt)}</small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="content-head-right">
                                        <button
                                            className={`upvote-btn ${userObj && p.likes?.includes(userObj._id) ? 'liked' : ''}`}
                                            onClick={() => handleUpvote(p._id)}
                                            title={userObj ? 'Like this product' : 'Login to like'}
                                        >
                                            <HeartOutline />
                                            <span>{p.likes?.length || 0}</span>
                                        </button>
                                        <a
                                            href={p.productUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="product-link-btn"
                                        >
                                            Visit
                                        </a>
                                    </div>
                                </div>

                                <div className="product-post">
                                    <Text style={{ marginBottom: '12px', lineHeight: '1.5' }}>
                                        <div
                                            style={{ fontSize: 14 }}
                                            dangerouslySetInnerHTML={{ __html: formatContent(p.productDescription) }}
                                        />
                                    </Text>

                                    {/* Featured Images with click to open carousel */}
                                    {p.featuredImages && p.featuredImages.length > 0 && (
                                        <div
                                            className="featured-images"
                                            style={{ marginTop: '12px' }}
                                        >
                                            {renderFeaturedImages(p.featuredImages)}
                                        </div>
                                    )}
                                </div>

                                <div className="post-enggage">
                                    <div className="left">
                                        <div className="comment">
                                            <ChatSquareOutline />
                                        </div>
                                        <div className="likes">
                                            <HeartOutline />
                                        </div>
                                        <div className="re-shared">
                                            <RepeatLinear />
                                        </div>
                                        <div className="views">
                                            <EyeLinear />
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="bucket">
                                            <BoxMinimalisticOutline />
                                        </div>
                                    </div>
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
