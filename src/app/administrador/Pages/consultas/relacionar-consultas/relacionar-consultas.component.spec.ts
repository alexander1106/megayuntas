import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionarConsultasComponent } from './relacionar-consultas.component';

describe('RelacionarConsultasComponent', () => {
  let component: RelacionarConsultasComponent;
  let fixture: ComponentFixture<RelacionarConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelacionarConsultasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelacionarConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
