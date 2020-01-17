import { BigNumber } from 'bignumber.js'

export const Tbn = (x: string | number): BigNumber => new BigNumber(x)

export function FromDecimal(x: string | number | BigNumber, n: number): BigNumber {
  return BigNumber.isBigNumber(x)
    ? x.times(10 ** n).integerValue()
    : Tbn(x)
        .times(10 ** n)
        .integerValue()
}

export function ToDecimal(x: string | number | BigNumber, n: number): BigNumber {
  return BigNumber.isBigNumber(x) ? x.div(10 ** n) : Tbn(x).div(10 ** n)
}

export function DecimalToHex(d: number | string): string {
  let hex = Tbn(d).toString(16)
  if (hex.length % 2 !== 0) {
    hex = '0' + hex
  }
  return '0x' + hex
}
