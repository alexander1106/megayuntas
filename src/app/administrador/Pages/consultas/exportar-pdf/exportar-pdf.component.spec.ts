import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportarPdfComponent } from './exportar-pdf.component';

describe('ExportarPdfComponent', () => {
  let component: ExportarPdfComponent;
  let fixture: ComponentFixture<ExportarPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportarPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportarPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
