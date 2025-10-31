import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarConsultasComponent } from './agregar-consultas.component';

describe('AgregarConsultasComponent', () => {
  let component: AgregarConsultasComponent;
  let fixture: ComponentFixture<AgregarConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarConsultasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
