export interface IDomainCurrency {
  full: fullName;

  short: shortName;
}

export type shortName = 'ltc' | 'btc' | 'eth' | 'etc' | 'bch' | 'waves' | 'xlm' | 'ton';
export type fullName =
  | 'litecoin'
  | 'bitcoin'
  | 'ethereum'
  | 'ethereumClassic'
  | 'bitcoinCash'
  | 'waves'
  | 'stellar'
  | 'ton';

export class DomainEthereum implements IDomainCurrency {
  static Instance(): DomainEthereum {
    return new DomainEthereum();
  }

  get full(): fullName {
    return 'ethereum';
  }

  get short(): shortName {
    return 'eth';
  }
}

export class DomainEthereumClassic implements IDomainCurrency {
  static Instance(): DomainEthereumClassic {
    return new DomainEthereumClassic();
  }

  get full(): fullName {
    return 'ethereumClassic';
  }

  get short(): shortName {
    return 'etc';
  }
}

export class DomainBitcoin implements IDomainCurrency {
  static Instance(): DomainBitcoin {
    return new DomainBitcoin();
  }

  get full(): fullName {
    return 'bitcoin';
  }

  get short(): shortName {
    return 'btc';
  }
}

export class DomainBitcoinCash implements IDomainCurrency {
  static Instance(): DomainBitcoinCash {
    return new DomainBitcoinCash();
  }

  get full(): fullName {
    return 'bitcoinCash';
  }

  get short(): shortName {
    return 'bch';
  }
}

export class DomainLitecoin implements IDomainCurrency {
  static Instance(): DomainLitecoin {
    return new DomainLitecoin();
  }

  get full(): fullName {
    return 'litecoin';
  }

  get short(): shortName {
    return 'ltc';
  }
}

export class DomainWaves implements IDomainCurrency {
  static Instance(): DomainWaves {
    return new DomainWaves();
  }

  get full(): fullName {
    return 'waves';
  }

  get short(): shortName {
    return 'waves';
  }
}

export class DomainStellar implements IDomainCurrency {
  static Instance(): DomainStellar {
    return new DomainStellar();
  }

  get full(): fullName {
    return 'stellar';
  }

  get short(): shortName {
    return 'xlm';
  }
}

export class DomainTON implements IDomainCurrency {
  static Instance(): DomainTON {
    return new DomainTON();
  }

  get full(): fullName {
    return 'ton';
  }

  get short(): shortName {
    return 'ton';
  }
}
