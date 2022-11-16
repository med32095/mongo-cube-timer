import clientPromise from "../../lib/mongodb";
import {ObjectId} from 'bson';


export default async (req, res) => {
    try {
        const { userID } = req.query
        // connect to the database
        const client = await clientPromise;
        const db = client.db("cuber");
        // add the time
        await db.collection('times').deleteMany({userID: userID});
        // return a message
        return res.json({
            message: 'times deleted successfully',
            success: true,
        });
    } catch (error) {
        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
};