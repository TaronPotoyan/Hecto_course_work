// src/app/services/DataBaseService/dataBase.spec.ts
import { TestBed } from '@angular/core/testing';

import { DataBase } from './dataBase';

describe('DataBase', () => {
  let service: DataBase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
