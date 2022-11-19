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
    
    return (`${len} | ${min} | ${avg} | ${max}`)
}

function avg5TwelveReadout(data) {
    let last5 = timeArray(data).slice(0,5)
    let sum5 = last5.reduce((a, b) => a + b, 0)
    let min5 = Math.min(...last5)
    let max5 = Math.max(...last5)
    let middleSum5 = sum5 - min5 - max5
    let avg5 = pretify(Math.floor(middleSum5/3))

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
        return (`avg5 ${avg5} | avg12 n/a`)
    } else {
        return (`avg5 ${avg5} | avg12 ${avg12}`)
    }
}

function bestFiveTwelveReadout(data) {
    function getAvg5(timeArray) {
        let sum5 = timeArray.reduce((a, b) => a + b, 0)
        let min5 = Math.min(...timeArray)
        let max5 = Math.max(...timeArray)
        let middleSum5 = sum5 - min5 - max5
        let avg5 = Math.floor(middleSum5/3)
        return avg5
    }
    
    function getAvg12(timeArray) {
        let sum12 = timeArray.reduce((a, b) => a + b, 0)
        let min12 = Math.min(...timeArray)
        let max12 = Math.max(...timeArray)
        let middleSum12 = sum12 - min12 - max12
        let avg12 = Math.floor(middleSum12/10)
        return avg12
    }

    let len = data.length

    let last5 = timeArray(data).slice(0,5)
    let last12 = timeArray(data).slice(0,12)

    function bestAvgFive(data) {
        let averages = []
        let len = data.length
        for (let i = 0; i < (len-4); i++) {
            let currentSlice = timeArray(data).slice(i,(i+5))
            averages.push(getAvg5(currentSlice));
        }
        return pretify(Math.min(...averages))
    }

    function bestAvgTwelve(data) {
        let averages = []
        let len = data.length
        for (let i = 0; i < (len-11); i++) {
            let currentSlice = timeArray(data).slice(i,(i+12))
            averages.push(getAvg12(currentSlice));
        }
        return pretify(Math.min(...averages))
    }

    
    if (len<5) {
        return (`bestAvg5 n/a | bestAvg12 n/a`)
    } else if (len<12) {
        return (`bestAvg5 ${bestAvgFive(data)} | bestAvg12 n/a`)
    } else {
        return (`bestAvg5 ${bestAvgFive(data)} | bestAvg12 ${bestAvgTwelve(data)}`)
    }
}

export default function UserStats({ session }) {
    const { data } = useTimes(session.user.id);
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
        if (confirm("delete all??")) {
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
                    {data? avg5TwelveReadout(data) : "no user data"}
                </div>
                <div>
                    {data? bestFiveTwelveReadout(data) : "no user data"}
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