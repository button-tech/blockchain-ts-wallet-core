export interface IDomainCurrency {

  full: string;

  short: shortName;

}

export type shortName = 'ltc' | 'btc' | 'eth' | 'etc' | 'bch' | 'waves' | 'xlm';
export type fullName = 'litecoin' | 'bitcoin' | 'ethereum' | 'ethereumClassic' | 'bitcoinCash' | 'waves' | 'stellar';

export class Ethereum implements IDomainCurrency {

  static Instance(): Ethereum {
    return new Ethereum();
  }

  get full(): fullName {
    return 'ethereum';
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
    return 'ethereumClassic';
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
    return 'bitcoin';
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
    return 'bitcoinCash';
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
    return 'litecoin';
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
    return 'waves';
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
    return 'stellar';
  }

  get short(): shortName {
    return 'xlm';
  }

}
