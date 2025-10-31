import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarAdministradoresModalComponent } from './eliminar-administradores-modal.component';

describe('EliminarAdministradoresModalComponent', () => {
  let component: EliminarAdministradoresModalComponent;
  let fixture: ComponentFixture<EliminarAdministradoresModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarAdministradoresModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EliminarAdministradoresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
