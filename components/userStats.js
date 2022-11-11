import Chart from "./chart";
import { useTimes } from "../hooks/useTimes.js";

import { useMutation, useQueryClient } from "react-query";
import axios from "axios";


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
        <div>
            <div className='py-5'>
                <Chart times={data}/>
            </div>
            <ul className='flex flex-col items-center'>
                {data?.map((time) => (
                    <li key={time._id} className='font-mono flex gap-4'>
                        {time.prettyTime}
                        <button onClick={() => deleteMutation.mutate(time._id)}>
                            x
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};