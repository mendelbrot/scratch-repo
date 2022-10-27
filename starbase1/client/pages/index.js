import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { supabase } from '../lib/supabaseClient'

export default function Home() {

  const handleSignin = async () => {
    const res = await supabase.auth.signIn({
      email: 'demo@example.com',
      password: 'password',
    })
    console.log(res)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>starbase1</title>
        <meta name="starbase1" content="a knowledge management app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={handleSignin}>Sign in</button>
      </main>
    </div>
  )
}
