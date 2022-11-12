import Chart from "./chart";
import { useTimes } from "../hooks/useTimes.js";

import { useMutation, useQueryClient } from "react-query";

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

    if (len<1) {
        return "log some times for stats"
    }
    
    return (`${len} : ${min} : ${max}`)
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
                <tbody className='overflow-y-auto h-60 sm:h-40'>
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
            </div>
            <div className='py-5'>
                <Chart times={data}/>
            </div>
        </div>
    );
};