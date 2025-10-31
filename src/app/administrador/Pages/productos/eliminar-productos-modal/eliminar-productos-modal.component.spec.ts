import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarProductosModalComponent } from './eliminar-productos-modal.component';

describe('EliminarProductosModalComponent', () => {
  let component: EliminarProductosModalComponent;
  let fixture: ComponentFixture<EliminarProductosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarProductosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EliminarProductosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
