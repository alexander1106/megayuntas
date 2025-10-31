import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaconsultaComponent } from './vistaconsulta.component';

describe('VistaconsultaComponent', () => {
  let component: VistaconsultaComponent;
  let fixture: ComponentFixture<VistaconsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaconsultaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistaconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
