import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import Timer from "../components/timer";


export default function Component() {
    const { data: session } = useSession()
    const [userTimes, setUserTimes] = useState(null);

    
    const getUserTimes = async (userID) => {
        try {
            const res = await fetch(`/api/userTimes?userID=${userID}`, {
                method: 'GET',
            });
            const data = await res.json()
            setUserTimes(data)
        } catch (error) {
            //error handling 
        } 
    };

    useEffect(()=>{
        if (session) {
            getUserTimes(session.user.id)
        }
    },[session])

    if(session) {
        if (userTimes) {
            return (
                <Timer
                    session={session}
                    userTimes={userTimes}
                    getUserTimes={getUserTimes}
                />
            )
        } else {
            return (
                <div>loading {session.user.name}'s times</div>
            )
        }
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