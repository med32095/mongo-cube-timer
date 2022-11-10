import { useTimes } from "../hooks/useTimes";
import Chart from "./chart";
import Stopwatch from "./stopwatch";

export default function NewTimer({ session }) {

    const { data, isLoading, isFetching } = useTimes(session.user.id)

    if (session) {
        if (isLoading) return <div>Loading</div>
        if (isFetching) return <div>fetching</div> //idk if necessary?
    
        return (
            <section>
                <Chart times={data} />
                <Stopwatch session={session} />
                <ul>
                    {data?.map((time) => (
                    <li key={time._id}>
                        {time.prettyTime}
                    </li>
                    ))}
                </ul>
                {/* {postCount <= 90 && (
                    <button
                    onClick={() => setPostCount(postCount + 10)}
                    disabled={isFetching}
                    >
                    {isFetching ? 'Loading...' : 'Show More'}
                    </button>
                )} */}
            </section>
        )
    }
    return (
        <div>
            no session
        </div>
    )
}