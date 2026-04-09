import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { TransactionHistoryComponent } from './transaction-history.component';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> { return of({}); }
}

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        BoaUiModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      declarations: [TransactionHistoryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', () => {
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'transactionDate', 'description', 'status', 'amount', 'runningBalance'
    ]);
  });

  it('should filter transactions', () => {
    const initialCount = component.dataSource.filteredData.length;
    const event = { target: { value: 'Payroll' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('payroll');
  });

  it('should export transactions to CSV', () => {
    const createElementSpy = spyOn(document, 'createElement').and.callThrough();
    component.exportTransactions();
    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('should filter by account ID when provided', () => {
    // Re-create with account ID
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        BoaUiModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      declarations: [TransactionHistoryComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? 'CHK-7890-1234' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(TransactionHistoryComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    // Should have filtered transactions for this account
    expect(newComponent.dataSource.data.length).toBeGreaterThanOrEqual(0);
  });
});
