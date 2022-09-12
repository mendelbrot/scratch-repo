/**
 * Get the real offset
 * @param element
 * @returns {Object} offset
 */
export const getOffset = (element) => {
  let offset = {
    left: 0,
    top: 0
  }
  let clientRect = element.getBoundingClientRect()

  while (element) {
    offset.top += element.offsetTop
    offset.left += element.offsetLeft
    element = element.offsetParent
  }

  // Calculate the delta between offset values and clientRect values
  let deltaLeft = offset.left - clientRect.left
  let deltaTop = offset.top - clientRect.top

  return {
    left:
      deltaLeft < 0
        ? offset.left + Math.abs(deltaLeft)
        : offset.left - Math.abs(deltaLeft),
    top:
      deltaTop < 0
        ? offset.top + Math.abs(deltaTop)
        : offset.top - Math.abs(deltaTop)
  }
}

/**
 * Make a promise to load image
 * @param src {String}
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.crossOrigin = 'Anonymous' // Work only if the server response headers contains [Access-Control-Allow-Origin: *]
    image.onload = () => {
      resolve(image)
    }
    image.src = src
    image.onerror = (event) => {
      const error = new Error(`Image ${src} is not loaded.`)
      reject(error)
    }
  })
}
