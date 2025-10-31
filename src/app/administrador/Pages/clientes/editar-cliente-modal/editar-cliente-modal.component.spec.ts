import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarClienteModalComponent } from './editar-cliente-modal.component';

describe('EditarClienteModalComponent', () => {
  let component: EditarClienteModalComponent;
  let fixture: ComponentFixture<EditarClienteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarClienteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarClienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
