import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAdministradoresModalComponent } from './editar-administradores-modal.component';

describe('EditarAdministradoresModalComponent', () => {
  let component: EditarAdministradoresModalComponent;
  let fixture: ComponentFixture<EditarAdministradoresModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAdministradoresModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarAdministradoresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
