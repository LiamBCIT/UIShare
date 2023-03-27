// import SiteNavigation from "../components/SiteNavigation"

import { SessionProvider } from "next-auth/react"

// import TimeAgo from 'javascript-time-ago'
// import en from 'javascript-time-ago/locale/en'
// TimeAgo.setDefaultLocale(en.locale)
// TimeAgo.addLocale(en)

function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>  
    </>
  )
}

export default MyApp