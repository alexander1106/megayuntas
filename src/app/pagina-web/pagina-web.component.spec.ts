import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaWebComponent } from './pagina-web.component';

describe('PaginaWebComponent', () => {
  let component: PaginaWebComponent;
  let fixture: ComponentFixture<PaginaWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaWebComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginaWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
