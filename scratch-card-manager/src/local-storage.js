const STORAGE_KEYS = {
  CLEARED: 'cleared',
  IMG_SRC: 'imgUrl',
  PRIZE_ID: 'prizeId',
  SESSION_ID: 'sessionId'
}

export const isCleared = () => {
  return Boolean(window.localStorage.getItem(STORAGE_KEYS.CLEARED))
}

export const setCleared = (value) => {
  window.localStorage.setItem(STORAGE_KEYS.CLEARED, value)
}

export const setLocalStorage = ({sessionId, prize}) => {
  const {IMG_SRC, PRIZE_ID, SESSION_ID} = STORAGE_KEYS
  if (window.localStorage.getItem(SESSION_ID) !== sessionId) {
    window.localStorage.clear()
    window.localStorage.setItem(SESSION_ID, sessionId)
    window.localStorage.setItem(PRIZE_ID, prize.id)
    window.localStorage.setItem(IMG_SRC, prize.imageSrc)
  }
}

export const getImageSrc = () => {
  return window.localStorage.getItem(STORAGE_KEYS.IMG_SRC)
}

export const getSessionId = () => {
  return window.localStorage.getItem(STORAGE_KEYS.SESSION_ID)
}
