import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { TransferFormComponent } from './transfer-form.component';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> { return of({}); }
}

describe('TransferFormComponent', () => {
  let component: TransferFormComponent;
  let fixture: ComponentFixture<TransferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        BoaUiModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      declarations: [TransferFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    expect(component.transferForm).toBeTruthy();
    expect(component.transferForm.get('fromAccount')).toBeTruthy();
    expect(component.transferForm.get('toAccount')).toBeTruthy();
    expect(component.transferForm.get('amount')).toBeTruthy();
    expect(component.transferForm.get('transferDate')).toBeTruthy();
  });

  it('should require fromAccount', () => {
    const ctrl = component.transferForm.get('fromAccount');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBeFalse();
    expect(ctrl?.errors?.['required']).toBeTruthy();
  });

  it('should require toAccount', () => {
    const ctrl = component.transferForm.get('toAccount');
    ctrl?.setValue('');
    expect(ctrl?.valid).toBeFalse();
  });

  it('should require positive amount', () => {
    const ctrl = component.transferForm.get('amount');
    ctrl?.setValue(-10);
    expect(ctrl?.valid).toBeFalse();
  });

  it('should accept valid amount', () => {
    const ctrl = component.transferForm.get('amount');
    ctrl?.setValue(100);
    expect(ctrl?.errors?.['min']).toBeFalsy();
  });

  it('should reject same from and to accounts', () => {
    component.transferForm.get('fromAccount')?.setValue('ACC001');
    component.transferForm.get('toAccount')?.setValue('ACC001');
    component.transferForm.get('amount')?.setValue(100);
    component.transferForm.updateValueAndValidity();
    expect(component.transferForm.errors?.['sameAccount']).toBeTruthy();
  });

  it('should allow different from and to accounts', () => {
    component.transferForm.get('fromAccount')?.setValue('ACC001');
    component.transferForm.get('toAccount')?.setValue('ACC002');
    component.transferForm.get('amount')?.setValue(100);
    component.transferForm.updateValueAndValidity();
    expect(component.transferForm.errors?.['sameAccount']).toBeFalsy();
  });

  it('should have frequency default to once', () => {
    const ctrl = component.transferForm.get('frequency');
    expect(ctrl?.value).toBe('once');
  });

  it('should have available accounts', () => {
    expect(component.fromAccounts.length).toBeGreaterThan(0);
  });
});
