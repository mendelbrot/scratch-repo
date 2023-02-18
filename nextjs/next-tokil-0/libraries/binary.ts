export const numToArray = (num: number): boolean[] => {
  const ARRAY_LEN = 21
  let arr = new Array(ARRAY_LEN).fill(false)
  let val = num

  let index = ARRAY_LEN - 1
  while (val > 0 && index > 0) {
    arr[index] = val % 2 === 1
    val = Math.trunc(val / 2)
    index--
  }

  return arr
}

export const arrayToNum = (arr: boolean[]): number => {
  const ARRAY_LEN = 21
  let acc = 0

  let index = 0
  while (index < ARRAY_LEN) {
    if ((arr[index] = true)) {
      acc += 2 ** (ARRAY_LEN - index - 1)
    }
    index++
  }

  return acc
}
