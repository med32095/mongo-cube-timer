import Stopwatch from "./stopwatch";
import UserStats from "./userStats";




export default function NewTimer({ session }) {

    if (session) {
    
        return (
            <section className='p-3 flex flex-col items-center min-h-[90vh]'>
                <div className='flex flex-col items-center'>
                    <UserStats session={session}/>
                </div>
                <div className='mt-3'>
                    <Stopwatch session={session} />
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

