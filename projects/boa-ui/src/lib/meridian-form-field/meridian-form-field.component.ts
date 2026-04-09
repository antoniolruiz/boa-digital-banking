import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Meridian Form Field - Custom form control wrapping mat-form-field.
 * Implements ControlValueAccessor for integration with Angular forms.
 */
@Component({
  selector: 'meridian-form-field',
  template: `
    <div class="meridian-form-field" [class.meridian-form-field--error]="hasError">
      <mat-form-field [appearance]="appearance" class="meridian-form-field-inner">
        <mat-label *ngIf="label">{{ label }}</mat-label>
        <span matPrefix *ngIf="prefix">{{ prefix }}</span>

        <ng-container [ngSwitch]="fieldType">
          <input *ngSwitchCase="'text'" matInput
                 [type]="inputType"
                 [placeholder]="placeholder"
                 [value]="value"
                 [disabled]="disabled"
                 [required]="required"
                 [attr.maxlength]="maxlength"
                 [attr.aria-label]="ariaLabel || label"
                 (input)="onInput($event)"
                 (blur)="onBlur()">

          <textarea *ngSwitchCase="'textarea'" matInput
                    [placeholder]="placeholder"
                    [value]="value"
                    [disabled]="disabled"
                    [required]="required"
                    [rows]="rows"
                    [attr.aria-label]="ariaLabel || label"
                    (input)="onInput($event)"
                    (blur)="onBlur()">
          </textarea>

          <mat-select *ngSwitchCase="'select'"
                      [value]="value"
                      [disabled]="disabled"
                      [required]="required"
                      [placeholder]="placeholder"
                      (selectionChange)="onSelectChange($event)">
            <mat-option *ngFor="let option of options" [value]="option.value">
              {{ option.label }}
            </mat-option>
          </mat-select>
        </ng-container>

        <span matSuffix *ngIf="suffix">{{ suffix }}</span>
        <mat-icon matSuffix *ngIf="suffixIcon">{{ suffixIcon }}</mat-icon>

        <mat-hint *ngIf="hint" [align]="hintAlign">{{ hint }}</mat-hint>
        <mat-error *ngIf="errorMessage">{{ errorMessage }}</mat-error>

        <span *ngIf="maxlength" matSuffix class="meridian-char-count">
          {{ (value || '').length }}/{{ maxlength }}
        </span>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .meridian-form-field {
      width: 100%;
      margin-bottom: 8px;
    }

    .meridian-form-field-inner {
      width: 100%;
    }

    .meridian-form-field--error .mat-form-field-outline {
      color: #DC1431;
    }

    .meridian-char-count {
      font-size: 12px;
      color: #767676;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MeridianFormFieldComponent),
      multi: true
    }
  ]
})
export class MeridianFormFieldComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() hint?: string;
  @Input() hintAlign: 'start' | 'end' = 'start';
  @Input() errorMessage?: string;
  @Input() fieldType: 'text' | 'textarea' | 'select' = 'text';
  @Input() inputType: 'text' | 'number' | 'email' | 'password' | 'tel' = 'text';
  @Input() appearance: 'outline' | 'fill' = 'outline';
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() suffixIcon?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() maxlength?: number;
  @Input() rows = 3;
  @Input() ariaLabel?: string;
  @Input() options: Array<{ value: string; label: string }> = [];
  @Input() hasError = false;

  @Output() valueChanged = new EventEmitter<string>();

  value = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;
    this.onChange(inputValue);
    this.valueChanged.emit(inputValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  onSelectChange(event: { value: string }): void {
    this.value = event.value;
    this.onChange(event.value);
    this.valueChanged.emit(event.value);
  }
}
