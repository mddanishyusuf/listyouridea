import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const { uid } = req.headers;
            const user = await User.findOne({ uid });
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const posts = await Post.find({})
                .populate({
                    path: 'author',
                    select: 'username photoURL name',
                })
                .sort({ createdAt: -1 })
                .exec();

            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { uid } = req.headers;
            const { productTitle, productDescription, productImage, featuredImages } = req.body;

            const user = await User.findOne({ uid });
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            // Validate required fields
            if (!productTitle || !productTitle.trim()) {
                return res.status(400).json({ error: 'Product title is required' });
            }

            if (!productDescription || !productDescription.trim()) {
                return res.status(400).json({ error: 'Product description is required' });
            }

            if (!productImage) {
                return res.status(400).json({ error: 'Product logo is required' });
            }

            if (!featuredImages || featuredImages.length === 0) {
                return res.status(400).json({ error: 'At least 1 featured image is required' });
            }

            if (featuredImages.length > 4) {
                return res.status(400).json({ error: 'Maximum 4 featured images allowed' });
            }

            // Validate word count (approximately)
            const wordCount = productDescription.split(' ').filter((word) => word.length > 0).length;
            if (wordCount > 100) {
                return res.status(400).json({ error: 'Product description must be 100 words or less' });
            }

            const postData = {
                author: user._id,
                type: 'product',
                productTitle: productTitle.trim(),
                productDescription: productDescription.trim(),
                productImage,
                featuredImages,
                completed: true,
            };

            const post = new Post(postData);
            await post.save();

            res.status(201).json(post);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
