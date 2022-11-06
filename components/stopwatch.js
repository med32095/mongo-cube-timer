import { useState } from "react"

export default function Stopwatch() {
    const [time, setTime] = useState(0);
    const [status, setStatus] = useState("zero");
    // const [min, setMin] = useState(0);
    // const [sec, setSec] = useState(0);
    // const [ms, setMs] = useState(0);
    const [readout, setReadout] = useState("0:00.000");
    let ms = 0
    let sec = 0
    let min = 0

    let interval = null;

    function handleClick() {
        if (interval === null) {
            interval = setInterval(startTimer, 1);
        }
        if (interval !== null) {
            console.log('stopped')
            interval = null;
            clearInterval(interval)
            ms = 0;
            sec = 0;
            min = 0
            setStatus("zero")
        }
    }

    function startTimer() {
        // setMs(ms+1);

        console.log(sec)
        ms++;
        if (ms>999) {
            // setMs(0)
            // setSec(sec+1)
            ms = 0;
            sec++;
            if (sec>59) {
                // setSec(0)
                // setMin(min+1)
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