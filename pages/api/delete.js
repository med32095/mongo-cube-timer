import clientPromise from "../../lib/mongodb";
import {ObjectId} from 'bson';

export default async (req, res) => {
    try {
        // Connecting to the database
        const client = await clientPromise;
        const db = client.db("cuber");
        // Deleting the time
        await db.collection('times').deleteOne({
            _id: new ObjectId(req.body),
        });
        // returning a message
        return res.json({
            message: 'time deleted successfully',
            success: true,
        });
    } catch (error) {

        // returning an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}