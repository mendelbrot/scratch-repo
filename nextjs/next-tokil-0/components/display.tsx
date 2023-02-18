'use client';

import '../styles/globals.css';
import {numToArray, arrayToNum} from '@/libs/binary'
import React, { useState } from 'react'

export default function Display(props: {patternNum: number}) {

  let [patternArr, setPatternArr] = useState(numToArray(props.patternNum))
  let patternNum = arrayToNum(patternArr)

  return (
    <div>
      <input type="number" />
      <div id="0" className='w-32 h-32 bg-amber-500'></div>
    </div>
  )
}