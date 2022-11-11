import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const { userID } = req.query
        const client = await clientPromise;
        const db = client.db("cuber");

        const times = await db
            .collection("times")
            // .find({ userID: "6369777b177774cec0ac8865" })
            .find({ userID: {$eq:userID}})
            .sort({ createdAt: -1 })
            .toArray();

        return res.json(times)
    } catch (error) {
        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}