import { TestBed } from '@angular/core/testing';

import { FilterProducts } from './filterProducts';

describe('FilterProducts', () => {
  let service: FilterProducts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterProducts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
