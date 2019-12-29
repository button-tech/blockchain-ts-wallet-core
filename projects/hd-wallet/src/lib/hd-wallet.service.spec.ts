import { TestBed } from '@angular/core/testing';

import { HdWalletService } from './hd-wallet.service';

describe('HdWalletService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HdWalletService = TestBed.get(HdWalletService);
    expect(service).toBeTruthy();
  });
});
