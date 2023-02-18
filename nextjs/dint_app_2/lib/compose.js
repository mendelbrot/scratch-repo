const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

export function curry11(f) {
  return function (a) {
    return function (b) {
      return f(a, b)
    }
  }
}

export function curry21(f) {
  return function (a, b) {
    return function (c) {
      return f(a, b, c)
    }
  }
}

export function curry111(f) {
  return function (a) {
    return function (b) {
      return function (c) {
        return f(a, b, c)
      }
    }
  }
}

export default compose