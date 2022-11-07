import clientPromise from "../lib/mongodb.js";
import { useState } from "react";
import { useRouter } from "next/router";
import Stopwatch from "../components/stopwatch";
import Chart from "../components/chart.js";
import { ObjectID } from "bson";

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component({ times }) {
    const [time, setTime] = useState(null)
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();
    const { data: session } = useSession()

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

    if(session) {
        return (
            <div className='flex justify-around gap-4 mt-3 sm:flex-col align-middle'>
                <div className='self-center'>
                    <Chart times={times} />
                </div>
                <div className='flex flex-col items-center gap-4 mt-3'>
                    <h1 className='text-7xl text-slate-800'>cube timer</h1>
                    <Stopwatch inserter={insertTime}/>
                    <ul className='p-1 gap-2 flex flex-col-reverse w-36'>
                        {times.map((times) => (
                            <li key={times._id}className='group flex gap-3 justify-between bg-slate-400 rounded px-3'>
                                <h2 className='font-mono'>{times.prettyTime}</h2>
                                <button onClick={() => deleteTime(times._id)} className='text-white hidden group-hover:flex sm:flex'>
                                    {deleting ? "..." : "x"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p>{session.user.name} </p>
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            </div>
        )
        
    }
    return <>
        <p>not signed in</p>
        <button onClick={() => signIn()}>Sign in</button>
    </>
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("cuber");

        const times = await db
            .collection("times")
            .find({})
            .sort({ createdAt: 1 })
            .toArray();

        return {
            props: { times: JSON.parse(JSON.stringify(times)) },
        };
    } catch (e) {
        console.error(e);
    }
}