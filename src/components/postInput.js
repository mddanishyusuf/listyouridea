import { useAuth } from '@/contexts/authContext';
import { CameraOutline, Emoji } from '@/lib/icons';
import { Text, Textarea, Input } from '@geist-ui/core';
import { useEffect, useRef, useState } from 'react';

const PostInput = ({ refreshPosts }) => {
    const { userObj } = useAuth();
    const [productTitle, setProductTitle] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [featuredImages, setFeaturedImages] = useState([]);

    const productImageInputRef = useRef(null);
    const featuredImageInputRef = useRef(null);
    const textareaRef = useRef(null);

    const handleFileSelect = (type = 'product') => {
        if (type === 'product' && productImageInputRef.current) {
            productImageInputRef.current.click();
        } else if (type === 'featured' && featuredImageInputRef.current) {
            featuredImageInputRef.current.click();
        }
    };

    const sendPost = async () => {
        const postData = {
            type: 'product',
            productTitle,
            productDescription,
            productImage,
            featuredImages,
        };

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                uid: userObj?.uid,
            },
            body: JSON.stringify(postData),
        });

        const data = await res.json();

        // Reset form
        setProductTitle('');
        setProductDescription('');
        setProductImage('');
        setFeaturedImages([]);

        refreshPosts();
    };

    const uploadFile = async (fileData, type = 'product') => {
        const formData = new FormData();
        formData.append('file', fileData);

        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                uid: userObj?.uid,
            },
            body: formData,
        });

        const data = await res.json();

        if (type === 'product') {
            setProductImage(data.url);
        } else if (type === 'featured') {
            setFeaturedImages((prev) => [...prev, data.url]);
        }
    };

    const handleFileChange = (event, type = 'product') => {
        const selectedFiles = type === 'featured' ? Array.from(event.target.files) : [event.target.files[0]];

        if (type === 'featured') {
            // Limit to 4 featured images max
            const remainingSlots = 4 - featuredImages.length;
            const filesToUpload = selectedFiles.slice(0, remainingSlots);

            filesToUpload.forEach((file) => {
                uploadFile(file, type);
            });
        } else {
            uploadFile(selectedFiles[0], type);
        }
    };

    const removeFeaturedImage = (indexToRemove) => {
        setFeaturedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const wordCount = productDescription.split(' ').filter((word) => word.length > 0).length;
    const canAddMoreImages = featuredImages.length < 4;
    const isFormValid = productTitle.trim() && productDescription.trim() && wordCount <= 100 && productImage && featuredImages.length >= 1; // At least 1 featured image required

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [productDescription]);

    return (
        <div className="post-input">
            <Text
                h4
                style={{ margin: '0 0 16px 0', color: '#007acc' }}
            >
                Share Your Product Idea
            </Text>

            <Input
                placeholder="Product Title *"
                width="100%"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                style={{
                    marginBottom: '12px',
                    borderColor: !productTitle.trim() ? '#ff4757' : undefined,
                }}
                status={!productTitle.trim() ? 'error' : 'default'}
            />

            <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Textarea
                    ref={textareaRef}
                    placeholder="Describe your product idea (max 100 words) *"
                    width="100%"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    maxLength={500}
                    status={!productDescription.trim() || wordCount > 100 ? 'error' : 'default'}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '12px',
                        fontSize: '12px',
                        color: wordCount > 100 ? '#ff4757' : '#666',
                        background: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                    }}
                >
                    {wordCount}/100 words
                </div>
            </div>

            <div
                className="upload-section"
                style={{ marginBottom: '12px' }}
            >
                {/* Product Logo Section */}
                <div
                    className="product-image-upload"
                    style={{ marginBottom: '16px' }}
                >
                    <Text
                        small
                        style={{ display: 'block', marginBottom: '8px' }}
                    >
                        Product Logo * {!productImage && <span style={{ color: '#ff4757' }}>(Required)</span>}
                    </Text>
                    {productImage ? (
                        <div
                            className="image-preview"
                            style={{ position: 'relative', display: 'inline-block' }}
                        >
                            <img
                                src={productImage}
                                alt="Product"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '2px solid #007acc',
                                }}
                            />
                            <button
                                onClick={() => setProductImage('')}
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#ff4757',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleFileSelect('product')}
                            className="button button--secondary"
                            style={{
                                padding: '8px 16px',
                                borderColor: '#ff4757',
                                color: '#ff4757',
                            }}
                        >
                            <CameraOutline />
                            <Text small>Upload Logo (Required)</Text>
                        </button>
                    )}
                </div>

                {/* Featured Images Section */}
                <div className="featured-image-upload">
                    <Text
                        small
                        style={{ display: 'block', marginBottom: '8px' }}
                    >
                        Featured Images * ({featuredImages.length}/4)
                        {featuredImages.length === 0 && <span style={{ color: '#ff4757' }}> - At least 1 required</span>}
                    </Text>

                    {featuredImages.length > 0 && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                gap: '8px',
                                marginBottom: '12px',
                                maxWidth: '320px',
                            }}
                        >
                            {featuredImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="image-preview"
                                    style={{ position: 'relative' }}
                                >
                                    <img
                                        src={image}
                                        alt={`Featured ${index + 1}`}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '1px solid #007acc',
                                        }}
                                    />
                                    <button
                                        onClick={() => removeFeaturedImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#ff4757',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '16px',
                                            height: '16px',
                                            cursor: 'pointer',
                                            fontSize: '10px',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {canAddMoreImages && (
                        <button
                            type="button"
                            onClick={() => handleFileSelect('featured')}
                            className="button button--secondary"
                            style={{
                                padding: '8px 16px',
                                borderColor: featuredImages.length === 0 ? '#ff4757' : undefined,
                                color: featuredImages.length === 0 ? '#ff4757' : undefined,
                            }}
                        >
                            <CameraOutline />
                            <Text small>{featuredImages.length === 0 ? 'Add Images (Required)' : `Add More Images (${4 - featuredImages.length} left)`}</Text>
                        </button>
                    )}

                    {featuredImages.length >= 4 && (
                        <Text
                            small
                            style={{ color: '#007acc' }}
                        >
                            Maximum 4 images reached
                        </Text>
                    )}
                </div>
            </div>

            {/* Validation Messages */}
            {!isFormValid && (
                <div
                    style={{
                        background: '#fff5f5',
                        border: '1px solid #ff4757',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '12px',
                    }}
                >
                    <Text
                        small
                        style={{ color: '#ff4757', margin: 0 }}
                    >
                        <strong>Please complete all required fields:</strong>
                    </Text>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                        {!productTitle.trim() && (
                            <li>
                                <Text
                                    small
                                    style={{ color: '#ff4757' }}
                                >
                                    Product title is required
                                </Text>
                            </li>
                        )}
                        {!productDescription.trim() && (
                            <li>
                                <Text
                                    small
                                    style={{ color: '#ff4757' }}
                                >
                                    Product description is required
                                </Text>
                            </li>
                        )}
                        {wordCount > 100 && (
                            <li>
                                <Text
                                    small
                                    style={{ color: '#ff4757' }}
                                >
                                    Description must be 100 words or less
                                </Text>
                            </li>
                        )}
                        {!productImage && (
                            <li>
                                <Text
                                    small
                                    style={{ color: '#ff4757' }}
                                >
                                    Product logo is required
                                </Text>
                            </li>
                        )}
                        {featuredImages.length === 0 && (
                            <li>
                                <Text
                                    small
                                    style={{ color: '#ff4757' }}
                                >
                                    At least 1 featured image is required
                                </Text>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            <div className="input-footer">
                {/* Hidden file inputs */}
                <input
                    type="file"
                    ref={productImageInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'product')}
                    accept="image/png, image/jpeg, image/jpg"
                    multiple={false}
                />
                <input
                    type="file"
                    ref={featuredImageInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'featured')}
                    accept="image/png, image/jpeg, image/jpg"
                    multiple={canAddMoreImages}
                />

                <div className="post-action">{/* Empty for now, can add other actions later */}</div>

                <button
                    className="button button--primary button-small"
                    onClick={() => sendPost()}
                    disabled={!isFormValid}
                    style={{
                        opacity: isFormValid ? 1 : 0.5,
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                    }}
                >
                    <Text small>Share Product Idea</Text>
                </button>
            </div>
        </div>
    );
};

export default PostInput;
