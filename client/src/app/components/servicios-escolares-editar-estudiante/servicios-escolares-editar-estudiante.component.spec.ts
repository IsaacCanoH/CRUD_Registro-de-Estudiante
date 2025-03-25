import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosEscolaresEditarEstudianteComponent } from './servicios-escolares-editar-estudiante.component';

describe('ServiciosEscolaresEditarEstudianteComponent', () => {
  let component: ServiciosEscolaresEditarEstudianteComponent;
  let fixture: ComponentFixture<ServiciosEscolaresEditarEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiciosEscolaresEditarEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosEscolaresEditarEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
