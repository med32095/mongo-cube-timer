import { useState } from "react"

import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function Stopwatch({ session }) {
    const [newReadout, setNewReadout] = useState("0:00.000");
    const [newInt, setNewInt] = useState(null);
    const [newStatus, setNewStatus] = useState(false);
    const [time, setTime] = useState(0);

    const queryClient = useQueryClient()

    const mutation = useMutation(newTime => {
        return axios.post('/api/insert', newTime)
      })

    let myTime;
    
    function handleClick() {
        //e prevent default in here?
        if (newStatus) {
            clearInterval(newInt)
            setNewStatus(false)
    
            let entry = {
                time: time,
                prettyTime: newReadout,
                createdAt: new Date().toISOString(),
                userID: session.user.id
            };
    
            mutation.mutate(entry)
        } else {
            setNewStatus(true)
            myTime = new Date()
            setNewInt(setInterval(newStartTimer, 10))
        }
    }

    // function newHandleClick() {
    //     if (newStatus) {
    //         clearInterval(newInt)
    //         setNewStatus(false)
    //         inserter(time,newReadout)
    //     } else {
    //         setNewStatus(true)
    //         myTime = new Date()
    //         setNewInt(setInterval(newStartTimer, 10))
    //     }
    // }

    function newStartTimer() {
        const d = new Date()
        let currentTime = d.getTime()
        let startTime = myTime.getTime()
        let elapse = currentTime - startTime
        setNewReadout(toReadout(elapse))
        setTime(elapse)
    }

    function toReadout(time) {
        let min = Math.floor(time/60000)
        let sec = Math.floor((time % 60000)/1000)
        let ms = time % 1000

        let _min = String(min)
        let _sec = String(sec)
        let _ms = String(ms)

        if (sec <= 9) {
            _sec = `0${sec}`
        }
        if (ms <= 99) {
            if (ms <= 9) {
                _ms = `00${ms}`
            } else {
                _ms = `0${ms}`
            }
        }
        
        return `${_min}:${_sec}.${_ms}`
    }

    return (
        <div className='flex flex-col gap-4 justify-between items-center border-4 border-slate-600 rounded-md p-4'>
            <div className='text-5xl text-slate-800 font-mono'>
                {newReadout}
            </div>

            <button onClick={handleClick} className='bg-slate-600 rounded px-2 text-white w-full hover:bg-slate-800 text-5xl flex justify-around py-6'>
                {newStatus ? "stop" : "start"}
            </button>
        </div>
    )
}