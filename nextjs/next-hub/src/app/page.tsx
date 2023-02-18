import Image from 'next/image'
import { Inter } from '@next/font/google'
import { testHelper } from '@/helpers'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <div>
        <p className={inter.className}>Hello Hub!</p>
        <p className="text-blue-600 hover:font-bold">{testHelper()}</p>
      </div>
    </main>
  )
}
