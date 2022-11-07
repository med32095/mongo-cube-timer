import clientPromise from "../lib/mongodb.js";
import { useState } from "react";
import { useRouter } from "next/router";
import Stopwatch from "../components/stopwatch";

export default function Home({ times }) {
    const [time, setTime] = useState(null)
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const insertTime = async (elapse,readout) => {
        // reset error and message
        setError('');
        setMessage('');

        // entry structure
        let entry = {
            time: elapse,
            prettyTime: readout,
            createdAt: new Date().toISOString(),
        };
        // save the time
        let response = await fetch('/api/insert', {
            method: 'POST',
            body: JSON.stringify(entry),
        });

        // get the data
        let data = await response.json();

        if (data.success) {
            // reset the fields
            router.push(router.asPath);
            
            // set the message
            return setMessage(data.message);
        } else {
            // set the error
            return setError(data.message);
        }
        };

    const deleteTime = async (timeID) => {
        //change deleting state
        setDeleting(true);

        try {
            // Delete time
            let res = await fetch('/api/delete', {
                method: 'DELETE',
                body: timeID,
            });
            
            let data = await res.json();

            // reset the deleting state
            setDeleting(false);

            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            // stop deleting state
            return setDeleting(false);
        }
    };

    return (
        <div className='flex flex-col items-center gap-4 mt-3'>
            {/* <div className='absolute top-1 left-1'>
                <div>time: {time}</div>
                <div>message: {message}</div>
                <div>error: {error}</div>
            </div> */}
            <h1 className='text-7xl text-slate-800'>cube timer</h1>
            <Stopwatch inserter={insertTime}/>
            <ul className='p-1 gap-2 flex flex-col w-36'>
                {times.map((times) => (
                    <li key={times._id}className='group flex gap-3 justify-between bg-slate-400 rounded px-3'>
                        <h2>{times.prettyTime}</h2>
                        <button onClick={() => deleteTime(times._id)} className='text-white hidden group-hover:flex'>
                            {deleting ? "..." : "x"}
                        </button>
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
            .sort({ createdAt: -1 })
            .toArray();

        return {
            props: { times: JSON.parse(JSON.stringify(times)) },
        };
    } catch (e) {
        console.error(e);
    }
}