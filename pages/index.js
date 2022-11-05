import clientPromise from "../lib/mongodb.js"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home({ times }) {
    const [time, setTime] = useState(null)
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const insertTime = async (e) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');

        // fields check. form validation???????
        if (!time) return setError('All fields are required');

        // entry structure
        let entry = {
            time: parseFloat(time),
            //createdAt: new Date().toISOString(),
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
            setTime('');
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
            // setMessage('time deleted') **** throws a weird error

            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            // stop deleting state
            return setDeleting(false);
        }
    };
    
    useEffect(() => {
        router.push(router.asPath)
    }, [message])

    return (
        <div className='flex flex-col items-center gap-4 mt-3'>
            <h1 className='text-6xl text-slate-800'>cube timer</h1>
            <div>
                <form onSubmit={insertTime} className='flex flex-col items-center gap-2'>
                    <input className='rounded w-36' inputMode="numeric" type="float" onChange={(e) => setTime(e.target.value)}/>
                    <div>{time}</div>
                    <div>{message}</div>
                    <div>{error}</div>
                    <button type="submit" className='bg-slate-600 text-white rounded py-1 px-2'>SUBMIT</button>
                </form>
            </div>
            {/* flex col reverse used to cheat reverse instead of implementing "createdat" in db */}
            <ul className='p-1 gap-2 flex flex-col-reverse w-36'>
                {times.map((times) => (
                    <li key={times._id}className='group flex gap-3 justify-between bg-slate-400 rounded px-3'>
                        <h2>{times.time}</h2>
                        <button onClick={() => deleteTime(times._id)} className='text-white hidden group-hover:flex'>
                            x
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
            .toArray();

        return {
            props: { times: JSON.parse(JSON.stringify(times)) },
        };
    } catch (e) {
        console.error(e);
    }
}