import { useState, useEffect } from "react"

export default function Stopwatch() {
    const [time, setTime] = useState(0);
    const [status, setStatus] = useState(false);
    const [readout, setReadout] = useState("0:00.000");
    const [int, setInt] = useState(null);
    let ms = 0
    let sec = 0
    let min = 0

    function handleClick() {
        if (status) {
            clearInterval(int)
            setStatus(false)
        } else {
            setStatus(true)
            setInt(setInterval(startTimer, 1))
            min = 0;
            sec = 0;
            ms = 0;
        }
    }

    function startTimer() {
        ms++;
        if (ms>999) {
            ms = 0;
            sec++;
            if (sec>59) {
                sec = 0;
                min++;
            }
        }
        setReadout(toReadout(min,sec,ms));
    }

    function toReadout(min,sec,ms) {
        let _min = String(min)
        let _sec = String(sec)
        let _ms = String(ms)

        return `${_min}:${_sec}.${_ms}`
    }

    useEffect( () => {
        console.log(status);
    }, [status]);

    return (
        <div className='flex flex-col gap-4 justify-between items-center border-4 border-slate-600 rounded-md p-4'>
            <div className='text-5xl text-slate-800'>
                {readout}
            </div>
            <div>{min}   {sec}   {ms}</div>
            <div>{status}</div>
            <button onClick={handleClick} className='bg-slate-600 rounded px-2 text-white w-full hover:bg-slate-800'>
                START
            </button>
        </div>
    )
}