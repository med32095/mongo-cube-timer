import clientPromise from "../lib/mongodb";

export default function Home({ times }) {
    return (
        <div>
            <h1>All Times</h1>
            <ul>
                {times.map((times) => (
                    <li key={times._id}>
                        <h2>{times.time.$numberDecimal}</h2>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("cuber");

        const times = await db
            .collection("times")
            .find({})
            .limit(20)
            .toArray();

        return {
            props: { times: JSON.parse(JSON.stringify(times)) },
        };
    } catch (e) {
        console.error(e);
    }
}