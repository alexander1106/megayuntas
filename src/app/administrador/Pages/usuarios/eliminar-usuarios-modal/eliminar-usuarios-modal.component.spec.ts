import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarUsuariosModalComponent } from './eliminar-usuarios-modal.component';

describe('EliminarUsuariosModalComponent', () => {
  let component: EliminarUsuariosModalComponent;
  let fixture: ComponentFixture<EliminarUsuariosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarUsuariosModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EliminarUsuariosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
