import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionDocenteComponent } from './observacion-docente.component';

describe('ObservacionDocenteComponent', () => {
  let component: ObservacionDocenteComponent;
  let fixture: ComponentFixture<ObservacionDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObservacionDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacionDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
