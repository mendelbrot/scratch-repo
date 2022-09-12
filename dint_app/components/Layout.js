import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import {curry11} from '/lib/compose'

export const siteTitle = 'dint'

const OuterWrapper = styled.div`
  background-color: fuchsia;
`

const InnerWrapper = styled.div`
  margin: auto;
  border: 3px solid black;
  max-width: 800px;
  background-color: white;
`

function Layout(props) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="dint: the dailly log, inventory, notebook, todo list, and more..."
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <main>
        <OuterWrapper>
          <InnerWrapper>
            <WrappedComponent {...props}/>
          </InnerWrapper>
        </OuterWrapper>
      </main>
      {!home && (
        <div>
          <Link href="/">
            <a>← Back to books list</a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Layout
