import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProductosModalComponent } from './editar-productos-modal.component';

describe('EditarProductosModalComponent', () => {
  let component: EditarProductosModalComponent;
  let fixture: ComponentFixture<EditarProductosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProductosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarProductosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
