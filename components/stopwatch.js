import { useState } from "react"

export default function Stopwatch() {
    const [newReadout, setNewReadout] = useState("0:00.000");
    const [newInt, setNewInt] = useState(null);
    const [newStatus, setNewStatus] = useState(false);
    let myTime;

    function newHandleClick() {
        if (newStatus) {
            clearInterval(newInt)
            setNewStatus(false)
        } else {
            setNewStatus(true)
            myTime = new Date()
            setNewInt(setInterval(newStartTimer, 10))
        }
    }

    function newStartTimer() {
        const d = new Date()
        let currentTime = d.getTime()
        let startTime = myTime.getTime()
        let elapse = currentTime - startTime
        console.log(elapse)
        setNewReadout(String(elapse))
    }

    function toReadout(min,sec,hs) {
        let _min = String(min)
        let _sec = String(sec)
        let _hs = String(hs)

        if (sec <= 9) {
            _sec = `0${sec}`
        }
        if (hs <= 9) {
            _hs = `0${hs}`
        }

        return `${_min}:${_sec}.${_hs}`
    }

    return (
        <div className='flex flex-col gap-4 justify-between items-center border-4 border-slate-600 rounded-md p-4'>
            <div className='text-5xl text-slate-800 font-mono'>
                {newReadout}
            </div>
            <button onClick={newHandleClick} className='bg-slate-600 rounded px-2 text-white w-full hover:bg-slate-800'>
                start
            </button>
        </div>
    )
}