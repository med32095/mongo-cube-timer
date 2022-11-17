import Chart from "./chart";
import { useTimes } from "../hooks/useTimes.js";

import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

function timeArray(data) {
    let times = []
    data.map(time => {
        times.push(time.time)
    })
    return times
}

function pretify(time) {
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

function statReadout(data) {
    let len = data.length
    let min = pretify(Math.min(...(timeArray(data))))
    let max = pretify(Math.max(...(timeArray(data))))
    let sum = timeArray(data).reduce((a, b) => a + b, 0)
    let avg = pretify(Math.floor(sum/len))

    if (len<1) {
        return "log some times for stats"
    }
    
    return (`${len} : ${min} : ${avg} : ${max}`)
}

function bestOfReadout(data) {
    let lastFive = timeArray(data).slice(0,5)
    let sum5 = lastFive.reduce((a, b) => a + b, 0)
    let min5 = Math.min(...lastFive)
    let max5 = Math.max(...lastFive)
    let middleSum5 = sum5 - min5 - max5
    let avgFive = pretify(Math.floor(middleSum5/3))

    let last12 = timeArray(data).slice(0,12)
    let sum12 = last12.reduce((a, b) => a + b, 0)
    let min12 = Math.min(...last12)
    let max12 = Math.max(...last12)
    let middleSum12 = sum12 - min12 - max12
    let avg12 = pretify(Math.floor(middleSum12/10))
    
    let len = data.length
    if (len<5) {
        return (`avg5 n/a | avg12 n/a`)
    } else if (len<12) {
        return (`avg5 ${avgFive} | avg12 n/a`)
    } else {
        return (`avg5 ${avgFive} | avg12 ${avg12}`)
    }
}

export default function UserStats({ session }) {
    const { data, isLoading, isFetching } = useTimes(session.user.id);
    const queryClient = useQueryClient()

    const deleteMutation = useMutation(
        async timeID => await fetch('/api/delete', {
            method: 'DELETE',
            body: timeID,
        }),
        {
        onSuccess: () => queryClient.invalidateQueries(['times', session.user.id]),
      })

      const deleteAllMutation = useMutation(
        async () => await fetch(`/api/deleteAll?userID=${session.user.id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['times', session.user.id])
            }
        }
    )

    function handleDeleteAll() {
        if (confirm("delete all???")) {
            deleteAllMutation.mutate(session.user.id)
        }
    }

    return (
        <div className='flex flex-col flex-1'>
            <table className='table-auto items-center flex flex-col rounded-md bg-slate-600 p-3'>
                <thead className='mb-4'>
                    <tr>
                        <th className='text-center text-2xl text-slate-300'>TIMES</th>
                    </tr>
                    <tr className='text-xs'>
                        <th className='text-center text-slate-500'>{data?.length < 1 ? 'no times in system' : "(click a time to delete it)"}</th>
                    </tr>
                </thead>
                <tbody className='overflow-y-auto h-40 sm:h-40'>
                    {data?.map((time) => (
                        <tr key={time._id} className='font-mono flex gap-4 mr-2'>
                            <td className='text-center rounded-full bg-slate-300 px-2 mb-1 hover:bg-slate-400'>
                                <button onClick={() => deleteMutation.mutate(time._id)}>
                                    {time.prettyTime}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='font-mono items-center flex flex-col text-slate-800'>
                <div>
                    {data? statReadout(data) : "no user data"}
                </div>
                <div>
                    {data? bestOfReadout(data) : "no user data"}
                </div>
                <div>
                    <button onClick={() => handleDeleteAll()}>
                        delete all
                    </button>
                </div>
            </div>
            <div className='py-5'>
                <Chart times={data}/>
            </div>
        </div>
    );
};