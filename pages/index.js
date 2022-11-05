import clientPromise from "../lib/mongodb.js"

export default function Home({ times }) {
    return (
        <div className='flex flex-col items-center gap-4 mt-3'>
            <h1 className='text-6xl text-slate-800'>All Times</h1>
            <div>
                <form className='flex flex-col items-center gap-2'>
                    <input className='rounded'/>
                    <button type="submit" className='bg-slate-600 text-white rounded py-1 px-2'>SUBMIT</button>
                </form>
            </div>
            <ul className='border-2 border-slate-600 rounded-md p-1'>
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
            .toArray();

        return {
            props: { times: JSON.parse(JSON.stringify(times)) },
        };
    } catch (e) {
        console.error(e);
    }
}