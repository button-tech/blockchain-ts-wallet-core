// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { EthereumClassic } from './currencies/ethereumClassic/ethereumClassic';
import { Ethereum } from './currencies/ethereum/ethereum';
import { EthereumTokens } from './currencies/tokens/tokens';
import { Bitcoin } from './currencies/bitcoin/bitcoin';
import { BitcoinCash } from './currencies/bitcoinCash/bitcoinCash';
import { Litecoin } from './currencies/litecoin/litecoin';
import { Waves } from './currencies/waves/waves';
import { Stellar } from './currencies/stellar/stellar';
import { IBlockchain, IContract } from './typings/ts-wallet-core.dto';

export default class TsWalletCore {
  static Ethereum(privateKey: string): IBlockchain {
    return Ethereum(privateKey);
  }

  static EthereumClassic(privateKey: string): IBlockchain {
    return EthereumClassic(privateKey);
  }

  static EthereumTokens(privateKey: string): IContract & IBlockchain {
    return EthereumTokens(privateKey);
  }

  static Bitcoin(privateKey: string): IBlockchain {
    return Bitcoin(privateKey);
  }

  static BitcoinCash(privateKey: string): IBlockchain {
    return BitcoinCash(privateKey);
  }

  static Litecoin(privateKey: string): IBlockchain {
    return Litecoin(privateKey);
  }

  static Waves(privateKey: string): IBlockchain {
    return Waves(privateKey);
  }

  static Stellar(privateKey: string): IBlockchain {
    return Stellar(privateKey);
  }
}


