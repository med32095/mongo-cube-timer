import Stopwatch from "./stopwatch";
import UserStats from "./userStats";

export default function NewTimer({ session }) {

    if (session) {
    
        return (
            <section className='p-3'>
                <Stopwatch session={session} />
                <UserStats session={session}/>
            </section>
        )
    }
    return (
        <div>
            no session
        </div>
    )
}