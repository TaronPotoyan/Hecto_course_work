// src/app/services/dataBaseService/dataBase.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DataBase } from './dataBase';

describe('DataBase', () => {
  let service: DataBase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DataBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
