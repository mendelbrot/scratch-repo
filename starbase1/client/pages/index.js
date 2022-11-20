import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { supabase } from '../lib/supabaseClient'

export default function Home() {

  // let email = 'demo@example.com'
  // let password = 'password'
  let email = 'dawn@supamail.com'
  let password = '11111111'

  const handleSignup = async () => {
    console.log('# sign up')
    const res = await supabase.auth.signUp({
      email: email,
      password: password
    })
    console.log(res)
  }

  const handleSignout = async () => {
    console.log('# sign out')
    const res = await supabase.auth.signOut()
    console.log(res)
  }

  const handleSignin = async () => {
    console.log('# sign in')
    const res = await supabase.auth.signIn({
      email: email,
      password: password
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
        <p>{email}</p>
        <p>{password}</p>
        <button onClick={handleSignup}>Sign up</button>
        <button onClick={handleSignin}>Sign in</button>
        <button onClick={handleSignout}>Sign out</button>
      </main>
    </div>
  )
}
