import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAdministradoresModalComponent } from './agregar-administradores-modal.component';

describe('AgregarAdministradoresModalComponent', () => {
  let component: AgregarAdministradoresModalComponent;
  let fixture: ComponentFixture<AgregarAdministradoresModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarAdministradoresModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarAdministradoresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
