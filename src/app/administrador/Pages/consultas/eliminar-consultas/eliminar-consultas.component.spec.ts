import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarConsultasComponent } from './eliminar-consultas.component';

describe('EliminarConsultasComponent', () => {
  let component: EliminarConsultasComponent;
  let fixture: ComponentFixture<EliminarConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarConsultasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EliminarConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
