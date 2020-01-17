import TsWalletCore from '../src/index'

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
