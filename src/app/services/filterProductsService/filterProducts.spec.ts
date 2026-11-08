import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { FilterProducts } from './filterProducts';

describe('FilterProducts', () => {
  let service: FilterProducts;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FilterProducts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
