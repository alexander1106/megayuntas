import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarPasosComponent } from './crear-editar-pasos.component';

describe('CrearEditarPasosComponent', () => {
  let component: CrearEditarPasosComponent;
  let fixture: ComponentFixture<CrearEditarPasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarPasosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEditarPasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
