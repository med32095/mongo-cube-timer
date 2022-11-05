import { useState } from "react"

export default function Stopwatch() {
    const [time, setTime] = useState(0);

    let min = "0"
    let sec = "00"
    let ms = "000"

    function startTimer() {

    }

    return (
        <div className='flex flex-col gap-4 justify-between items-center border-4 border-slate-600 rounded-md p-4'>
            <div className='text-5xl text-slate-800'>
                {min}:{sec}.{ms}
            </div>
            <button className='bg-slate-600 rounded px-2 text-white w-full hover:bg-slate-800'>
                START
            </button>
        </div>
    )
}