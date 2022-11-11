import Stopwatch from "./stopwatch";
import UserStats from "./userStats";

export default function NewTimer({ session }) {

    if (session) {
    
        return (
            <section className='p-3 flex flex-col items-center'>
                <div>
                    <Stopwatch session={session} />
                </div>
                <div className='flex flex-col items-center'>
                    <UserStats session={session}/>
                </div>
            </section>
        )
    }
    return (
        <div>
            no session
        </div>
    )
}