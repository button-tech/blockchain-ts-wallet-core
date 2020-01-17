import TsWalletCore from '../src/ts-wallet-core'

/**
 * Dummy test
 */
describe('TsWalletCore test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Class creation', () => {
    expect(new TsWalletCore()).toBeInstanceOf(TsWalletCore)
  })
})
