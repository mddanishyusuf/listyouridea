import Layout from '@/components/layout';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/posts', {
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

    const renderFeaturedImages = (images) => {
        if (!images || images.length === 0) return null;

        const getImageLayout = (count) => {
            switch (count) {
                case 1:
                    return {
                        container: { display: 'grid', gap: '4px', borderRadius: '12px', overflow: 'hidden' },
                        imageStyle: { width: '100%', height: '300px', objectFit: 'cover' },
                    };
                case 2:
                    return {
                        container: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '4px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                        },
                        imageStyle: { width: '100%', height: '250px', objectFit: 'cover' },
                    };
                case 3:
                    return {
                        container: {
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr',
                            gap: '4px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            height: '300px',
                        },
                        imageStyle: { width: '100%', height: '100%', objectFit: 'cover' },
                        rightColumnStyle: { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '4px' },
                    };
                case 4:
                    return {
                        container: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gridTemplateRows: '1fr 1fr',
                            gap: '4px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            height: '400px',
                        },
                        imageStyle: { width: '100%', height: '100%', objectFit: 'cover' },
                    };
                default:
                    return {
                        container: { display: 'grid', gap: '8px' },
                        imageStyle: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' },
                    };
            }
        };

        const layout = getImageLayout(images.length);

        if (images.length === 3) {
            return (
                <div style={layout.container}>
                    <img
                        src={images[0]}
                        alt="Featured 1"
                        style={layout.imageStyle}
                    />
                    <div style={layout.rightColumnStyle}>
                        <img
                            src={images[1]}
                            alt="Featured 2"
                            style={layout.imageStyle}
                        />
                        <img
                            src={images[2]}
                            alt="Featured 3"
                            style={layout.imageStyle}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div style={layout.container}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Featured ${index + 1}`}
                        style={layout.imageStyle}
                    />
                ))}
            </div>
        );
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
                                        </h3>{' '}
                                    </div>
                                    <div className="posted-date">
                                        <Text
                                            small
                                            type="secondary"
                                        >
                                            {moment(p.createdAt).fromNow()}
                                        </Text>
                                    </div>
                                </div>

                                <div className="product-post">
                                    {/* <Text
                                        type="secondary"
                                        small
                                        style={{ fontSize: 13 }}
                                    >
                                        by {p.author?.username}
                                    </Text> */}
                                    <Text style={{ marginBottom: '12px', lineHeight: '1.5' }}>
                                        <div
                                            style={{ fontSize: 14 }}
                                            dangerouslySetInnerHTML={{ __html: formatContent(p.productDescription) }}
                                        />
                                    </Text>

                                    {/* Featured Images with layouts for 1-4 images */}
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
        </>
    );
}
