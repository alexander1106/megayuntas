import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarConsultasComponent } from './editar-consultas.component';

describe('EditarConsultasComponent', () => {
  let component: EditarConsultasComponent;
  let fixture: ComponentFixture<EditarConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarConsultasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
