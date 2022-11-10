import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"

import {QueryClient, QueryClientProvider,} from 'react-query'

const queryClient = new QueryClient()

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
  }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp
