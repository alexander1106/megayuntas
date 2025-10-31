import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaproductoComponent } from './vistaproducto.component';

describe('VistaproductoComponent', () => {
  let component: VistaproductoComponent;
  let fixture: ComponentFixture<VistaproductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaproductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VistaproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
