import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { ReactQueryDevtools } from 'react-query/devtools'

import {QueryClient, QueryClientProvider,} from 'react-query'

const queryClient = new QueryClient()

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
  }) {
  return (
    //idk if to switch session provider and queryclient provider
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp
