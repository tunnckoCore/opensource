import { qux } from 'foo'
export const BAR_PKG = 123

export const add = (a, b) => {
  return a + b + qux(a, b)
}
