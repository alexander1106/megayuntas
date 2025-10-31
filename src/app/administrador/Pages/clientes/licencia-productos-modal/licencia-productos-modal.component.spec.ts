import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciaProductosModalComponent } from './licencia-productos-modal.component';

describe('LicenciaProductosModalComponent', () => {
  let component: LicenciaProductosModalComponent;
  let fixture: ComponentFixture<LicenciaProductosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenciaProductosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LicenciaProductosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
