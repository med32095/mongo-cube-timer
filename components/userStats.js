import Chart from "./chart";
import { useTimes } from "../hooks/useTimes.js";


export default function UserStats({ session }) {
    const { data, isLoading, isFetching } = useTimes(session.user.id);

    return (
        <div>
            <Chart times={data}/>
            <ul>
                {data?.map((time) => (
                    <li key={time._id}>
                        {time.prettyTime}
                    </li>
                ))}
            </ul>
        </div>
    );
};