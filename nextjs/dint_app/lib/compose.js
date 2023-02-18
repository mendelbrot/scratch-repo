const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

export const curry11 = f => a => b => f(a,b)

export default compose