import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

/**
 * Custom translate loader for tests that returns empty translations
 */
export class FakeTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<Record<string, string>> {
    return of({});
  }
}

/**
 * Common test module configuration used across all test suites.
 * This pattern is common in Angular 14 apps and will need migration
 * when moving to standalone components.
 */
export function getCommonTestModuleMetadata(): TestModuleMetadata {
  return {
    imports: [
      NoopAnimationsModule,
      HttpClientTestingModule,
      RouterTestingModule,
      ReactiveFormsModule,
      FormsModule,
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
      })
    ]
  };
}

/**
 * Configure TestBed with common imports.
 * Helper to reduce boilerplate in tests.
 */
export function configureTestBed(moduleDef: TestModuleMetadata): void {
  const commonConfig = getCommonTestModuleMetadata();

  TestBed.configureTestingModule({
    imports: [...(commonConfig.imports || []), ...(moduleDef.imports || [])],
    declarations: [...(moduleDef.declarations || [])],
    providers: [...(moduleDef.providers || [])],
    schemas: [...(moduleDef.schemas || [])]
  });
}

/**
 * Creates a mock MatDialogRef for dialog testing
 */
export function createMockDialogRef(): { close: jasmine.Spy; afterClosed: () => Observable<unknown> } {
  return {
    close: jasmine.createSpy('close'),
    afterClosed: () => of(undefined)
  };
}

/**
 * Formats a date string for display in tests
 */
export function formatTestDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
