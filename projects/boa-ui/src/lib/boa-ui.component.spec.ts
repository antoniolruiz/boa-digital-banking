import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoaUiComponent } from './boa-ui.component';

describe('BoaUiComponent', () => {
  let component: BoaUiComponent;
  let fixture: ComponentFixture<BoaUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoaUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoaUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
