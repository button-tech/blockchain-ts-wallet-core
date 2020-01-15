import { IDomainCurrency } from '../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { CurrencyFactoryOptions, PrivateKeys } from '../../shared.module';
import { HdWallet } from '../../services/hd-wallet/hd-wallet.service';

export function getPrivateKey(currency: IDomainCurrency, opt: CurrencyFactoryOptions) {
  if (typeof opt.secret === 'string') {
    return fromMnemonic(currency, opt);
  } else if ((opt.secret as PrivateKeys)[currency.full]) {
    if (opt.derivationPath === 0) {
      return fromPrivateKeyObject(currency, opt.secret);
    } else {
      opt.secret = opt.secret.Waves;
      return fromMnemonic(currency, opt);
    }
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

export function fromMnemonic(currency: IDomainCurrency, opt: CurrencyFactoryOptions): string {
  const hdWallet = new HdWallet(opt.secret as string, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return keys.privateKey;
}

export function fromPrivateKeyObject(currency: IDomainCurrency, secret: PrivateKeys): string {
  return secret[currency.full];
}
