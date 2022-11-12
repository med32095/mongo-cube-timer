import { useSession, signIn } from "next-auth/react"
import Timer from "../components/timer";

export default function Component() {
    const { data: session } = useSession()

    if (session) {
        return (
            <Timer session={session} />
        )
    }
    
    return (
        <div className='flex justify-center m-5'>
            <div className="flex flex-col gap-3 p-3 border-4 rounded-md border-slate-600 w-auto">
                <div className='text-center text-slate-800 text-2xl'>
                    use cloud saves ?
                </div>
                <button 
                    onClick={() => signIn()}
                    className='text-slate-800 bg-slate-400 text-2xl rounded-md'
                >
                    sign in
                </button>
                <button 
                    onClick={() => alert("this feature coming soon !!")}
                    className='text-slate-800 bg-slate-400 text-2xl rounded-md'
                >
                    guest
                </button>
            </div>
        </div>
    )
}