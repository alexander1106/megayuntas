import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuariosModalComponent } from './editar-usuarios-modal.component';

describe('EditarUsuariosModalComponent', () => {
  let component: EditarUsuariosModalComponent;
  let fixture: ComponentFixture<EditarUsuariosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarUsuariosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarUsuariosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
