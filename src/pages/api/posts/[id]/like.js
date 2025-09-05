import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { id } = req.query;
        const { uid } = req.headers;

        const user = await User.findOne({ uid });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const isLiked = post.likes.includes(user._id);

        if (isLiked) {
            // Unlike
            post.likes = post.likes.filter((likeId) => !likeId.equals(user._id));
        } else {
            // Like
            post.likes.push(user._id);
        }

        await post.save();
        res.status(200).json({ liked: !isLiked, likesCount: post.likes.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
