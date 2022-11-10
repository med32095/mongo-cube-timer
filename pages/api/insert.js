import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        // connect to the database
        const client = await clientPromise;
        const db = client.db("cuber");
        // add the time
        await db.collection('times').insertOne(req.body);
        // return a message
        return res.json({
            message: 'time added successfully',
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