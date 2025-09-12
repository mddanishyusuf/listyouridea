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
                <div className="container">
                    <header className="header">
                        <div className="header-left">
                            {/* Heroicons Logo */}
                            <div className="logo">
                                <img
                                    src="/kitchen-svg.svg"
                                    height={30}
                                    width={30}
                                />
                                <h4>Kitchen SVG</h4>
                            </div>

                            {/* Version Dropdown */}
                            <div className="version-dropdown">
                                <button className="version-btn">
                                    Premium
                                    {/* <ChevronDownIcon className="chevron-icon" /> */}
                                </button>
                            </div>
                        </div>

                        {/* Share Button */}
                        <a
                            href="https://twitter.com/intent/tweet?text=Check%20out%20Heroicons"
                            className="share-btn"
                        >
                            {/* <ShareIcon className="share-icon" /> */}
                            <span>
                                Share<span className="share-text-extended"> on Twitter</span>
                            </span>
                        </a>
                    </header>

                    {/* Main Content */}
                    <main className="main-content">
                        <div className="hero-section">
                            <div className="hero-text">
                                <div className="hero-stats">
                                    <p>500+ icons</p>
                                    <span className="divider" />
                                    <p>React & Vue libraries</p>
                                </div>

                                <h1 className="hero-title">Kitchen & Food SVG Icon Pack — 200+ Designs</h1>

                                <div className="action-buttons">
                                    <a
                                        href="https://github.com/tailwindlabs/heroicons"
                                        className="action-btn"
                                    >
                                        <svg
                                            className="github-icon"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
                                            />
                                        </svg>
                                        Documentation
                                    </a>

                                    <a
                                        href="https://www.figma.com/community/file/1143911270904274171"
                                        className="action-btn"
                                    >
                                        <svg
                                            className="figma-icon"
                                            viewBox="0 0 24 24"
                                            strokeWidth=".895"
                                        >
                                            <path
                                                d="M11.554 4v-.447H8.738a2.553 2.553 0 1 0 0 5.105H11.554V4Z"
                                                fill="#DF5A33"
                                                stroke="#DF5A33"
                                            />
                                            <path
                                                d="M11.554 9.895v-.448H8.738a2.553 2.553 0 0 0 0 5.106H11.554V9.895Z"
                                                fill="#985CF7"
                                                stroke="#985CF7"
                                            />
                                            <path
                                                d="M11.554 15.79v-.448H8.738a2.553 2.553 0 0 0 0 5.105h.132a2.684 2.684 0 0 0 2.684-2.684V15.79Z"
                                                fill="#5ECC89"
                                                stroke="#5ECC89"
                                            />
                                            <path
                                                d="M15.262 9.447a2.553 2.553 0 1 1 0 5.106h-.263a2.553 2.553 0 0 1 0-5.106h.263Z"
                                                fill="#57B9F8"
                                                stroke="#57B9F8"
                                            />
                                            <path
                                                d="M12.446 4v-.447H15.262a2.553 2.553 0 1 1 0 5.105H12.446V4Z"
                                                fill="#EE7A69"
                                                stroke="#EE7A69"
                                            />
                                        </svg>
                                        Get Figma File
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
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
                                        <div className="image-preview">
                                            <div className="image">
                                                <img
                                                    src={p.featuredImages[0]}
                                                    alt="Post image"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.parentNode.style.display = 'none';
                                                    }}
                                                />
                                            </div>
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
