import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualProductosModalComponent } from './manual-productos-modal.component';

describe('ManualProductosModalComponent', () => {
  let component: ManualProductosModalComponent;
  let fixture: ComponentFixture<ManualProductosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualProductosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualProductosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
