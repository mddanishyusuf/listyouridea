import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import formidable from 'formidable';
import AWS from 'aws-sdk';
import { randomString } from '@/lib/functions';
import path from 'path';

// Configure AWS S3 or DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT || 'sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { uid } = req.headers;
        const user = await User.findOne({ uid });
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        const form = formidable({
            maxFiles: 1,
            maxFileSize: 10 * 1024 * 1024, // 10MB
        });

        const [fields, files] = await form.parse(req);
        const file = files.file?.[0];

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileSlugName = randomString(12, 'aA#');
        const fileExt = path.extname(file.originalFilename);

        const params = {
            Bucket: process.env.SPACE_NAME,
            Body: require('fs').readFileSync(file.filepath),
            Key: `media/${fileSlugName}${fileExt}`,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };

        const data = await s3.upload(params).promise();
        res.status(200).json({ url: data.Location });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
}
