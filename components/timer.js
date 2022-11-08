import Stopwatch from "../components/stopwatch";
import Chart from "../components/chart.js";
import { useState } from "react";
import { signOut } from "next-auth/react";


export default function Timer({ session, userTimes, getUserTimes }) {
    const [deleting, setDeleting] = useState(false);

    const insertTime = async (elapse,readout) => {
    
        // entry structure
        let entry = {
            time: elapse,
            prettyTime: readout,
            createdAt: new Date().toISOString(),
            userID: session.user.id
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
            getUserTimes(session.user.id);
        } else {
            //error handling?
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
            // reset the deleting state
            setDeleting(false);
    
            // reload the page
            getUserTimes(session.user.id)
        } catch (error) {
            // stop deleting state
            return setDeleting(false);
        }
    };

    return (
        <div className='flex justify-around gap-4 mt-3 sm:flex-col align-middle'>
                    {/* chart */}
                    <div className='self-center'>
                        <Chart times={userTimes} />
                    </div>

                    {/* stopwatch */}
                    <div className='flex flex-col items-center gap-4 mt-3'>
                        <h1 className='text-7xl text-slate-800'>cube timer</h1>
                        <Stopwatch inserter={insertTime}/>
                    </div>

                    {/* user info and user times */}
                    <div>
                        <p>{session.user.name} </p>
                        <p>{session.user.id}</p>
                        <button onClick={() => signOut()}>Sign out</button>
                        <div>
                        <ul className='p-1 gap-2 flex flex-col-reverse w-36'>
                            {(userTimes).map((times) => (
                                <li key={times._id}className='group flex gap-3 justify-between bg-slate-400 rounded px-3'>
                                    <h2 className='font-mono'>{times.prettyTime}</h2>
                                    <button onClick={() => deleteTime(times._id)} className='text-white hidden group-hover:flex sm:flex'>
                                        {deleting ? "..." : "x"}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                </div>
    )
}

