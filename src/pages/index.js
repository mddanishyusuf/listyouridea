import Layout from '@/components/layout';
import ImageCarousel from '@/components/ImageCarousel'; // Add this import
import { useAuth } from '@/contexts/authContext';
import { formatContent } from '@/lib/functions';
import { BoxMinimalisticOutline, ChatSquareOutline, EyeLinear, HeartOutline, RepeatLinear } from '@/lib/icons';
import { Text } from '@geist-ui/core';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default function Home() {
    const { userObj } = useAuth();
    const [posts, setPosts] = useState([]);
    const [refreshPosts, setRefreshPosts] = useState(0);

    // Add carousel state
    const [carouselImages, setCarouselImages] = useState([]);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const [carouselInitialIndex, setCarouselInitialIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/posts?status=published', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        uid: userObj?.uid,
                    },
                });
                const result = await res.json();
                setPosts(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userObj) fetchData();
    }, [userObj, refreshPosts]);

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
                        onClick={() => openCarousel(images, index)} // Add click handler
                    />
                ))}
            </div>
        );
    };

    // Add upvote functionality (optional)
    const handleUpvote = async (postId) => {
        if (!userObj) return;

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

    return (
        <>
            <Layout>
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
                                        <h3
                                            style={{ fontSize: 15 }}
                                            b
                                        >
                                            {p.productTitle}
                                        </h3>
                                    </div>
                                    <div className="content-head-right">
                                        <button
                                            className={`upvote-btn ${p.likes?.includes(userObj?._id) ? 'liked' : ''}`}
                                            onClick={() => handleUpvote(p._id)}
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
