import { useState, useEffect } from 'react';
import { Text } from '@geist-ui/core';

const ImageCarousel = ({ images, isOpen, onClose, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (!isOpen || !images || images.length === 0) return null;

    return (
        <div
            className="carousel-overlay"
            onClick={onClose}
        >
            <div
                className="carousel-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    className="carousel-close"
                    onClick={onClose}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <line
                            x1="18"
                            y1="6"
                            x2="6"
                            y2="18"
                        ></line>
                        <line
                            x1="6"
                            y1="6"
                            x2="18"
                            y2="18"
                        ></line>
                    </svg>
                </button>

                {/* Image counter */}
                <div className="carousel-counter">
                    <Text
                        small
                        type="secondary"
                    >
                        {currentIndex + 1} / {images.length}
                    </Text>
                </div>

                {/* Main image */}
                <div className="carousel-main">
                    <img
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="carousel-image"
                    />
                </div>

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            className="carousel-nav carousel-nav-left"
                            onClick={goToPrevious}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="15,18 9,12 15,6"></polyline>
                            </svg>
                        </button>
                        <button
                            className="carousel-nav carousel-nav-right"
                            onClick={goToNext}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                        </button>
                    </>
                )}

                {/* Thumbnail navigation */}
                {images.length > 1 && (
                    <div className="carousel-thumbnails">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCarousel;
