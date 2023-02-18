import '../styles/globals.css'
import Display from '@/comps/display'

export default function Home() {
  let num = 255
  return (
    <div>
      <div className="font-bold">tokil</div>
      <Display patternNum={num} />
    </div>
  )
}
