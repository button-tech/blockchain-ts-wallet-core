export interface IDomainCurrency {

  full: string;

  short: shortName;

}

export type shortName = 'ltc' | 'btc' | 'eth' | 'etc' | 'bch' | 'waves' | 'xlm' | 'ton';
export type fullName = 'Litecoin' | 'Bitcoin' | 'Ethereum' | 'EthereumClassic' | 'BitcoinCash' | 'Waves' | 'Stellar' | 'Ton';

export class Ethereum implements IDomainCurrency {

  static Instance(): Ethereum {
    return new Ethereum();
  }

  get full(): fullName {
    return 'Ethereum';
  }

  get short(): shortName {
    return 'eth';
  }

}

export class EthereumClassic implements IDomainCurrency {

  static Instance(): EthereumClassic {
    return new EthereumClassic();
  }

  get full(): fullName {
    return 'EthereumClassic';
  }

  get short(): shortName {
    return 'etc';
  }

}

export class Bitcoin implements IDomainCurrency {

  static Instance(): Bitcoin {
    return new Bitcoin();
  }

  get full(): fullName {
    return 'Bitcoin';
  }

  get short(): shortName {
    return 'btc';
  }

}

export class BitcoinCash implements IDomainCurrency {

  static Instance(): BitcoinCash {
    return new BitcoinCash();
  }

  get full(): fullName {
    return 'BitcoinCash';
  }

  get short(): shortName {
    return 'bch';
  }

}

export class Litecoin implements IDomainCurrency {

  static Instance(): Litecoin {
    return new Litecoin();
  }

  get full(): fullName {
    return 'Litecoin';
  }

  get short(): shortName {
    return 'ltc';
  }

}

export class Waves implements IDomainCurrency {

  static Instance(): Waves {
    return new Waves();
  }

  get full(): fullName {
    return 'Waves';
  }

  get short(): shortName {
    return 'waves';
  }

}

export class Stellar implements IDomainCurrency {

  static Instance(): Stellar {
    return new Stellar();
  }

  get full(): fullName {
    return 'Stellar';
  }

  get short(): shortName {
    return 'xlm';
  }

}

export class TON implements IDomainCurrency {

  static Instance(): TON {
    return new TON();
  }

  get full(): fullName {
    return 'Ton';
  }

  get short(): shortName {
    return 'ton';
  }

}
