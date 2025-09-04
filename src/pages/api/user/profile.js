import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { randomString, nameToUsername } from '@/lib/functions';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { uid } = req.headers;
        const { displayName, email, username, photoURL } = req.body;

        let user = await User.findOne({ uid });

        if (!user) {
            const generatedUsername = await nameToUsername(displayName);
            const userObj = {
                name: displayName || '',
                username: generatedUsername,
                email,
                uid,
                api_key: randomString(32, 'aA#'),
                photoURL,
            };

            const newUser = new User(userObj);
            user = await newUser.save();
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
