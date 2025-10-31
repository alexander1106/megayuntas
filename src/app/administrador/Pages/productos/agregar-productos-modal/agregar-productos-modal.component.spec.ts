import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProductosModalComponent } from './agregar-productos-modal.component';

describe('AgregarProductosModalComponent', () => {
  let component: AgregarProductosModalComponent;
  let fixture: ComponentFixture<AgregarProductosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarProductosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarProductosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
