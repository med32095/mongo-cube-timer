import { ObjectID } from "bson";
import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const { id } = req.query
       const client = await clientPromise;
       const db = client.db("sample_mflix");

       const movies = await db
           .collection("movies")
           .find({ _id: new ObjectID(`${id}`)})
           .toArray()

       res.json(movies);
   } catch (e) {
       console.error(e);
   }
};