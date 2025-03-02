import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosEscolaresRegistroEstudianteComponent } from './servicios-escolares-registro-estudiante.component';

describe('ServiciosEscolaresRegistroEstudianteComponent', () => {
  let component: ServiciosEscolaresRegistroEstudianteComponent;
  let fixture: ComponentFixture<ServiciosEscolaresRegistroEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiciosEscolaresRegistroEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosEscolaresRegistroEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
