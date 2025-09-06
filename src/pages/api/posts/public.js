// src/pages/api/posts/public.js
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { category, limit = 50, page = 1 } = req.query;

        let query = { status: 'published' };

        // Add category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await Post.find(query)
            .populate({
                path: 'author',
                select: 'username photoURL name',
            })
            .sort({ publishedAt: -1, createdAt: -1 }) // Show most recently published first
            .limit(parseInt(limit))
            .skip(skip)
            .exec();

        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching public posts:', err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
